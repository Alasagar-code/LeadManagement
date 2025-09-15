
const leads = require("../models/lead");
const mongoose = require("mongoose");

const toarray = (val) => {
  return typeof val === "string" ? val.split(",").map((s) => s.trim()) : [];
};

const buildfilters = (q, userId) => {
  const f = { createdBy: userId };

  // email
  if (q.email) f.email = q.email;
  if (q.email_contains) f.email = { $regex: q.email_contains, $options: "i" };

  // company
  if (q.company) f.company = q.company;
  if (q.company_contains) f.company = { $regex: q.company_contains, $options: "i" };

  // city
  if (q.city) f.city = q.city;
  if (q.city_contains) f.city = { $regex: q.city_contains, $options: "i" };

  // status
  if (q.status) f.status = q.status;
  if (q.status_in) f.status = { $in: toarray(q.status_in) };

  // source
  if (q.source) f.source = q.source;
  if (q.source_in) f.source = { $in: toarray(q.source_in) };

  // score
  if (q.score) f.score = Number(q.score);
  if (q.score_gt) f.score = { ...(f.score || {}), $gt: Number(q.score_gt) };
  if (q.score_lt) f.score = { ...(f.score || {}), $lt: Number(q.score_lt) };
  if (q.score_between) {
    const [min, max] = q.score_between.split(",").map(Number);
    f.score = { $gte: min, $lte: max };
  }

  // lead_value
  if (q.lead_value) f.lead_value = Number(q.lead_value);
  if (q.lead_value_gt) f.lead_value = { ...(f.lead_value || {}), $gt: Number(q.lead_value_gt) };
  if (q.lead_value_lt) f.lead_value = { ...(f.lead_value || {}), $lt: Number(q.lead_value_lt) };
  if (q.lead_value_between) {
    const [min, max] = q.lead_value_between.split(",").map(Number);
    f.lead_value = { $gte: min, $lte: max };
  }

  // createdAt filters
  if (q.created_at_on) {
    const d = new Date(q.created_at_on);
    if (!isNaN(d)) {
      d.setHours(0, 0, 0, 0);
      const d2 = new Date(d);
      d2.setHours(23, 59, 59, 999);
      f.createdAt = { $gte: d, $lte: d2 };
    }
  }
  if (q.created_at_before) f.createdAt = { ...(f.createdAt || {}), $lte: new Date(q.created_at_before) };
  if (q.created_at_after) f.createdAt = { ...(f.createdAt || {}), $gte: new Date(q.created_at_after) };
  if (q.created_at_between) {
    const [a, b] = q.created_at_between.split(",").map((s) => new Date(s));
    f.createdAt = { $gte: a, $lte: b };
  }

  // last_activity_at filters
  if (q.last_activity_at_on) {
    const d = new Date(q.last_activity_at_on);
    if (!isNaN(d)) {
      d.setHours(0, 0, 0, 0);
      const d2 = new Date(d);
      d2.setHours(23, 59, 59, 999);
      f.last_activity_at = { $gte: d, $lte: d2 };
    }
  }
  if (q.last_activity_at_before) f.last_activity_at = { ...(f.last_activity_at || {}), $lte: new Date(q.last_activity_at_before) };
  if (q.last_activity_at_after) f.last_activity_at = { ...(f.last_activity_at || {}), $gte: new Date(q.last_activity_at_after) };
  if (q.last_activity_at_between) {
    const [a, b] = q.last_activity_at_between.split(",").map((s) => new Date(s));
    f.last_activity_at = { $gte: a, $lte: b };
  }

  // is_qualified
  if (q.is_qualified !== undefined) {
    if (q.is_qualified === "true" || q.is_qualified === "false") {
      f.is_qualified = q.is_qualified === "true";
    }
  }

  return f;
};

//create lead
const createlead = async (req, res) => {
  try {
    const data = { ...req.body, createdBy: req.user._id };
    const lead = await leads.create(data);
    return res.status(201).json(lead);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email must be unique" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//get multiple leads
const getleads = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    let limit = parseInt(req.query.limit) || 20;
    limit = Math.min(limit, 100);
    const filters = buildfilters(req.query, req.user._id);

    const total = await leads.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);
    const skip = (page - 1) * limit;

    const data = await leads.find(filters).sort(
      { createdAt: -1 }
    )
    .skip(skip)
    .limit(limit)
    .lean();
    return res.status(200).json({ data, page, limit, total, totalPages });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//get singlelead
const getlead=async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const lead = await leads.findOne({ _id: id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

//update lead
const updatelead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const updatedData = { ...req.body, last_activity_at: new Date() };
    const lead = await leads.findOneAndUpdate({ _id: id, createdBy: req.user._id }, updatedData, { new: true, runValidators: true });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json(lead);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: "Email must be unique" });
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};


//Delete lead
const deletelead = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });
    const lead = await leads.findOneAndDelete({ _id: id, createdBy: req.user._id });
    if (!lead) return res.status(404).json({ message: "Lead not found" });
    return res.status(200).json({ message: "Lead deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports={
    createlead,
    getleads,
    getlead,
    updatelead,
    deletelead
}
