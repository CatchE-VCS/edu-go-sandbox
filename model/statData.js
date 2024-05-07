const mongoose = require('mongoose');

const statDataSchema = new mongoose.Schema({
    compressedDataKiloBytes: Number,
    actualDataKiloBytes: Number,
    numberOfRequests: Number,
    statCreatedAt: Number,
    statUpdatedAt: Number,
    organizationId: String,
    userRole: String,
    userId: String,
});


statDataSchema.pre('save', function (next) {
    this.statCreatedAt = Date.now();
    next();
});

statDataSchema.pre('update', function (next) {
    this.statUpdatedAt = Date.now();
    this.increment();
    next();
});

statDataSchema.pre('findOneAndUpdate', function (next) {
    this.statUpdatedAt = Date.now();
    this.increment();
    next();
});

statDataSchema.pre('updateOne', function (next) {
    this.statUpdatedAt = Date.now();
    this.increment();
    next();
});

statDataSchema.pre('updateMany', function (next) {
    this.statUpdatedAt = Date.now();
    this.increment();
    next();
});



module.exports = mongoose.model('statData', statDataSchema);