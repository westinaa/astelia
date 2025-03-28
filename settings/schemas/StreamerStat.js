const { Schema, model } = require("mongoose");

const StreamerStat = Schema({
    guildID: String,
    userID: String,
    channelID: { type: String, default: 0 }, // Buraya ekliyoruz
    channelData: { type: Number, default: 0 },
    TotalStat:  { type: Number, default: 0 },
    DailyStat:  { type: Number, default: 0 },
    WeeklyStat:  { type: Number, default: 0 },
    MonthlyStat:  { type: Number, default: 0 },
});

module.exports = model("StreamerStat", StreamerStat);