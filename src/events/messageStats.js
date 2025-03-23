const conf = require("../../settings/configs/sunucuayar.json");
const allah = require("../../config.js");
const messageUser = require("../../settings/schemas/messageUser");
const messageGuild = require("../../settings/schemas/messageGuild");
const guildChannel = require("../../settings/schemas/messageGuildChannel");
const userChannel = require("../../settings/schemas/messageUserChannel");
const client = global.bot;
const nums = new Map();
const mesaj = require("../../settings/schemas/mesajgorev");


module.exports = async (message) => {
  if (message.author.bot || !message.guild || message.content.startsWith(allah.Main.prefix)) return;
  
  if (!conf.sahipRolu.some(x => message.member.roles.cache.has(x))) {
    const num = nums.get(message.author.id);
    if (num && (num % allah.Main.messageCount) === 0) {
      nums.set(message.author.id, num + 1);
    } else nums.set(message.author.id, num ? num + 1 : 1);
  }

  await messageUser.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await messageGuild.findOneAndUpdate({ guildID: message.guild.id }, { $inc: { topStat: 1, dailyStat: 1, weeklyStat: 1, twoWeeklyStat: 1 } }, { upsert: true });
  await guildChannel.findOneAndUpdate({ guildID: message.guild.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
  await userChannel.findOneAndUpdate({ guildID: message.guild.id,  userID: message.author.id, channelID: message.channel.id }, { $inc: { channelData: 1 } }, { upsert: true });
const mesajData = await mesaj.findOne({ guildID: message.guild.id, userID: message.author.id });
if(mesajData){
if(message.channel.id !== conf.chatChannel) return;
await mesaj.findOneAndUpdate({ guildID: message.guild.id, userID: message.author.id }, { $inc: { mesaj: 1 } }, { upsert: true });
}
};

module.exports.conf = {
  name: "messageCreate",
};
