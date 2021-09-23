const mongoose = require("mongoose");
const Event = require("../models/Event");
var moment = require("moment");

const { Router } = require("express");

// function createEvent(req, res, next) {
//   const event = Event(req.body)

//   await event.save()
//   res.status(200)
// }

const createEvent = async (req, res, next) => {
  try {
    console.log(req.body);
    const event = new Event(req.body);
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

const getEvent = async (req, res, next) => {
  try {
    const event = await Event.find({
      projectId: req.params.projectId,
    });
    res.status(200).json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEvent,
  createEvent,
};
