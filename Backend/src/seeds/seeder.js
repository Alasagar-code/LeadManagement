// src/seeds/seeder.js
require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");
const connectDB = require("../config/database");
const User = require("../models/user");
const Lead = require("../models/lead");

const TEST_USER = { name: "Test User", email: "test@demo.com", password: "Test@1234" };

const createLeadsForUser = async (userId, n = 100) => {
  const bulk = [];
  const sources = ["website", "facebook_ads", "google_ads", "referral", "events", "other"];
  const statuses = ["new", "contacted", "qualified", "lost", "won"];
  for (let i = 0; i < n; i++) {
    bulk.push({
      createdBy: userId,
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email().toLowerCase(),
      phone: faker.phone.number(),
      company: faker.company.name(),
      city: faker.location.city(),
      state: faker.location.state(),
      source: faker.helpers.arrayElement(sources),
      status: faker.helpers.arrayElement(statuses),
      score: faker.number.int({ min: 0, max: 100 }),
      lead_value: faker.number.float({ min: 0, max: 10000, precision: 0.01 }),
      last_activity_at: faker.date.recent({ days: 90 }),
      is_qualified: faker.datatype.boolean(),
    });
  }
  await Lead.insertMany(bulk);
  console.log(`Inserted ${n} leads`);
};

const run = async () => {
  await connectDB();
  await User.deleteMany({});
  await Lead.deleteMany({});
  const user = await User.create(TEST_USER);
  console.log("Created test user:", TEST_USER.email, "password:", TEST_USER.password);
  await createLeadsForUser(user._id, 100);
  mongoose.connection.close();
  console.log("Seeding completed.");
};

run().catch((err) => { 
    console.error(err);
});
