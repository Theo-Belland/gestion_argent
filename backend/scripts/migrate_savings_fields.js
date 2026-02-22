const mongoose = require('mongoose');
const Savings = require('../models/Savings');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gestion_argent';

async function migrate() {
  await mongoose.connect(MONGO_URI);
  const savingsList = await Savings.find({});
  let updated = 0;

  for (const savings of savingsList) {
    let needsUpdate = false;
    if (typeof savings.interestRate !== 'number') {
      savings.interestRate = 0;
      needsUpdate = true;
    }
    if (!['annual', 'monthly'].includes(savings.frequency)) {
      savings.frequency = 'annual';
      needsUpdate = true;
    }
    if (!savings.startDate || isNaN(new Date(savings.startDate))) {
      savings.startDate = savings.date || new Date();
      needsUpdate = true;
    }
    if (!savings.lastUpdate || isNaN(new Date(savings.lastUpdate))) {
      savings.lastUpdate = new Date();
      needsUpdate = true;
    }
    if (needsUpdate) {
      await savings.save();
      updated++;
    }
  }
  console.log(`Migration terminée. ${updated} documents mis à jour.`);
  mongoose.disconnect();
}

migrate().catch(err => {
  console.error('Erreur migration:', err);
  mongoose.disconnect();
});
