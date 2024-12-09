
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: { type: String, required: [true, "pune bro nume nu fi neserios"]},
    description: { type: String, required: [true, "pune bro descriere nu fi neserios"]},
    rating: { type: Number, default: 5},
    image: { type: String, required: [true, "pune bro imagine nu fi neserios"]},
    author: { type: String, required: [true]},
    reviewCount: { type: Number, default: 0},
},{
    timestamps: true,
})

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;