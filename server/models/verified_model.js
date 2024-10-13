const mongoose = require('mongoose');
const express = require('express');
const multer = require('multer');
const userEvent = require('@testing-library/user-event');
const VerifiedSchema = new mongoose.Schema({


v_id: { 
    type: Number, 
    unique: true 
},

v_img:{
    type: String
},

v_username: {
    type: String
},

v_emailadd: {
    type: String
},

v_fname: {
    type: String
},

v_lname: {
    type: String
},

v_mname: {
    type: String
},

v_password: {
    type: String
},

v_repassword: {
    type: String
},

v_add: {
    type: String
},

v_contactnumber: {
    type: Number
},

v_gender: {
    type: String
},

v_birthdate: {
    type: String
},

v_validID:{
    type: String
},

v_role:{
    type: String,
    default: 'verified'
}



});
const Verified = mongoose.model('Verified', VerifiedSchema);
module.exports = Verified;