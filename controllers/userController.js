import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import User from '../mongodb/models/user.js';

export const signup = async (req, res) => {
	const {
    name,
    email,
    password,
    isAdmin,
    address,
    city,
    state,
    contactNumber,
  } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email });
	} catch (error) {
		return console.log(error);
	}

	if (existingUser) {
		console.log(existingUser);
		return res.status(400).json({ message: 'User already redistered...!' });
	}

	const hashedPassword = bcrypt.hashSync(password, 10);

	const user = new User({
		name,
		email,
		password: hashedPassword,
		isAdmin,
		address,
		city,
		state,
		contactNumber,
	});

	user
		.save()
		.then((data) => {
			const {
				_id,
				name,
				email,
				password,
				isAdmin,
				address,
				city,
				state,
				contactNumber,
				created_at,
      		} = user;
			return res.status(201).json({
				message: 'User created Successfully!',
				user: { _id, name, email, password, isAdmin, address, city, state, contactNumber, created_at },
			});
		})
		.catch((err) => {
			res.status(400).json({ err });
		});
};


export const signin = async (req, res) => {
	const { email, password } = req.body;

	let user;
	try {
		user = await User.findOne({ email });
	} catch (error) {
		return console.log(error);
	}

	if (!user) {
		return res.status(404).json({ message: 'User not registered!' });
	}

	const isPasswordCorrect = bcrypt.compareSync(password, user.password);

	if (!isPasswordCorrect) {
		return res.status(400).json({ message: 'Incorrect Password' });
	}

	{
		const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY, {
			expiresIn: '3h',
		});
		const { _id, name, email, isAdmin, address, city, state, contactNumber } = user;
		res.cookie('token', token, { expiresIn: '3h' });

		return res
      .status(200)
      .json({
        token,
        user: { _id, name, email, isAdmin, address, city, state, contactNumber },
      });
	}
};


export const signout = (req, res) => {
	res.clearCookie('token');
	return res.status(200).json({ message: 'Signout Successfull' });
};


export const userInfo = async (req, res) => {
	const userId = req.params.id;
	let user;

	try {
		user = await User.findById(userId);
	} catch (err) {
		return res.status(400).json({ err });
	}

	if (!user) {
		return res.status(404).json({ message: 'No user found' });
	}
	return res.status(200).json({ user });
};

export const getAllUsers = async (req, res) => {
	let users;
	try {
		users = await User.find();
	} catch (err) {
		return console.log(err);
	}
	if (!users) {
		return res.status(404).json({ message: "No User Found" });
	}
	return res.status(200).json({ users });
}

export const deleteUser = async (req, res, next) => {
    const id = req.params.id;

    let user;
    try {
        user = await User.findByIdAndRemove(id);
    } catch (err) {
        return console.log(err);
    }
    if(!user) {
        return res.status(400).json({ message: "Unable to delete" });
    }
    return res.status(200).json({ message: "Successfully Deleted"});
}