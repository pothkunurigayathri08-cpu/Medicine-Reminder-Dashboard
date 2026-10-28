const express = require('express');
const cors = require('cors');
require('dotenv').config();
const supabase = require('./supabase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Medicine Reminder API is running successfully!' });
});

// GET: Fetch all medicines
app.get('/api/medicines', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: Add a new medicine
app.post('/api/medicines', async (req, res) => {
  try {
    const { name, dosage, time, frequency, notes } = req.body;
    
    if (!name || !dosage || !time || !frequency) {
      return res.status(400).json({ error: 'Please fill in all required fields.' });
    }

    const { data, error } = await supabase
      .from('medicines')
      .insert([{ name, dosage, time, frequency, notes }])
      .select();

    if (error) throw error;
    res.status(201).json(data[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: Remove a medicine
app.delete('/api/medicines/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('medicines')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(200).json({ message: 'Medicine deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});