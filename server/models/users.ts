import mongoose from 'mongoose';

const { Schema } = mongoose;

const user = new Schema({
    username: { type: String, required: true },
    password: { type: String, required: true },
});
  
user.set('toJSON', { getters: true });

const Users = mongoose.model('Users', user);

export default Users;
