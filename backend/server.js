const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());


app.get('/api/analytics', async (req, res) => {
  try {
    const totalRes = await db.query('SELECT COUNT(*) FROM leads');
    const totalLeads = parseInt(totalRes.rows[0].count);

    const statusRes = await db.query('SELECT status, COUNT(*) FROM leads GROUP BY status');
    const recentRes = await db.query('SELECT * FROM leads ORDER BY created_at DESC LIMIT 5');

    const statusCounts = {
      'New Lead': 0, 'Contacted': 0, 'Site Visit Scheduled': 0, 'Proposal Sent': 0, 'Won': 0, 'Lost': 0
    };
    statusRes.rows.forEach(row => { 
      if(row.status) statusCounts[row.status] = parseInt(row.count); 
    });

    const wonLeads = statusCounts['Won'] || 0;
    const conversionRate = totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0;

    res.json({ totalLeads, statusCounts, conversionRate, recentLeads: recentRes.rows });
  } catch (err) {
    console.error('GET /api/analytics error:', err);
    res.status(500).json({ error: 'Data aggregation failure', details: err.message });
  }
});

// filter
app.get('/api/leads', async (req, res) => {
  try {
    const { status, searchLocation, startDate, endDate } = req.query;
    let queryText = 'SELECT * FROM leads WHERE 1=1';
    const queryParams = [];
    let counter = 1;

    if (status) {
      queryText += ` AND status = $${counter}`;
      queryParams.push(status);
      counter++;
    }
    if (searchLocation) {
      queryText += ` AND location ILIKE $${counter}`;
      queryParams.push(`%${searchLocation}%`);
      counter++;
    }
    if (startDate && endDate) {
      queryText += ` AND created_at BETWEEN $${counter} AND $${counter + 1}`;
      queryParams.push(startDate, `${endDate} 23:59:59`);
      counter += 2;
    }

    queryText += ' ORDER BY created_at DESC';
    const result = await db.query(queryText, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/leads error:', err);
    res.status(500).json({ error: 'Query runtime interruption', details: err.message });
  }
});

app.post('/api/leads', async (req, res) => {
  const { full_name, phone, email, location, property_type, system_size, source } = req.body;
  
  // validation
  if (!full_name || !phone || !email || !location || !property_type || !system_size || !source) {
    return res.status(400).json({ error: 'All schema entry items are completely mandatory' });
  }

  try {
    const queryText = `
      INSERT INTO leads (full_name, phone, email, location, property_type, system_size, source, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`;
    

      const parsedSize = parseFloat(system_size);
    const defaultStatus = 'New Lead';

    const values = [full_name, phone, email, location, property_type, parsedSize, source, defaultStatus];
    
    const result = await db.query(queryText, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('DATABASE INSERTION err');
    console.error('Message:', err);
    console.error('Detail:', err.detail);    
    res.status(500).json({ error: `Database rejection: ${err.message}` });
  }
});

app.patch('/api/leads/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await db.query(
      'UPDATE leads SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Target consumer record not located' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error('PATCH /api/leads/:id/status error:', err);
    res.status(500).json({ error: 'State update query tracking dropped', details: err.message });
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM leads WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Record missing from relational stack' });
    res.json({ message: 'Lead item terminated successfully' });
  } catch (err) {
    console.error('DELETE /api/leads/:id error:', err);
    res.status(500).json({ error: 'Internal pipeline fault', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));