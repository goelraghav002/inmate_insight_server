import mongoose from "mongoose";

const User = new mongoose.Schema({
    name: {
		type: String,
		trim: true,
		required: true,
		min: 3,
		max: 30,
	},
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		min: 3,
		max: 40,
	},
	password: {
		type: String,
		trim: true,
		required: true,
		min: 6,
		max: 40,
	},
	isAdmin: {
		type: Boolean,
		required: true,
		default: false,
	},
	address: {
		type: String,
		trim: true,
		required: false,
		min: 3,
	},
	city: {
		type: String,
		trim: true,
		required: false,
		min: 3,
	},
	state: {
		type: String,
		trim: true,
		required: false,
		min: 3,
	},
	contactNumber: {
        type: Number,
        trim: true,
        unique: true,
        required: true,
        min: 6000000000,
        max: 9999999999,
    },
	created_at: {
        type: Date,
        required: true,
        default: Date.now,
    },
})

const UserSchema = mongoose.model('User', User);

export default UserSchema;