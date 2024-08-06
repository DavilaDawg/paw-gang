import models from '../models/events';
import { Request, Response } from 'express';

interface Event {
  place_id: string;
  park_name: string;
  address: string;
  date: Date;
  user: string;
  dog_avatar: string;
}

export const getEvents = async (req: Request, res: Response): Promise<void> => {
  try {
    const events: Event[] = await models.find();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getEventsbyPark = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { place_id } = req.params;

    if (!place_id) {
      res.status(400).json({ message: 'place_id is required' });
    }

    const events: Event[] = await models.find({ place_id });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getEventsbyUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = req.params.user;
    if (!user) {
      res.status(400).json({ message: 'user is required' });
    }

    const events: Event[] = await models.find({ user });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const postEvents = async (
  req: Request<{}, {}, Event>,
  res: Response
): Promise<void> => {
  try {
    const { place_id, park_name, address, date, user, dog_avatar } = req.body;

    if (!place_id || !park_name || !address || !date || !user || !dog_avatar) {
      res.status(400).json({ error: 'Missing required parameters.' });
    }
    const newEvent: Event = await models.create({
      place_id,
      park_name,
      address,
      date,
      user,
      dog_avatar
    });
    res.status(201);
    res.json(newEvent);
  } catch (error) {
    console.error('Internal server error');
    res.status(500);
  }
};

export const deleteEvent = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { _id } = req.params;

    if (!_id) {
      res.status(400).json({ message: '_id is required' });
    }

    const deletedEvent: Event | null = await models.findByIdAndDelete(_id);

    if (!deletedEvent) {
      res.status(404).json({ message: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};

export const editEvent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { _id } = req.params;
    const { date } = req.body;

    if (!_id) {
      res.status(400).json({ message: '_id is required' });
    }

    if (!date) {
      res.status(400).json({ message: 'date is required for updating' });
    }

    const updatedEvent: Event | null = await models.findByIdAndUpdate(
      _id,
      { date },
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      res.status(404).json({ message: 'Event not found' });
    }

    res
      .status(200)
      .json({ message: 'Event updated successfully', updatedEvent });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
