const { } = require("discord.js");
const CameraStat = require("../../../settings/schemas/CameraStat");
const messageUser = require("../../../settings/schemas/messageUser");
const voiceUser = require("../../../settings/schemas/voiceUser");
const voiceUserParent = require("../../../settings/schemas/voiceUserParent");
const isimler = require("../../../settings/schemas/names");
const allah = require("../../../config.js");
const StreamerStat = require("../../../settings/schemas/StreamerStat");
const moment = require("moment");
require("moment-duration-format");
const path = require('path');
moment.locale("tr");
const Canvas = require('@napi-rs/canvas');
const { registerFont } = require("canvas");
registerFont('./MarlinGeo-Black.otf', { family: 'Marlin Geo Black' });
const client = global.bot;
const ayar = require("../../../settings/configs/ayarName.json");

module.exports = {
  conf: {
    aliases: ["stats"],
    name: "stats",
    help: "stats",
    category: "stat",
  },
  
  run: async (client, message, args, prefix) => {

    let kanallar = ayar.ownerkomutkulanım;
    if (!message.member.permissions.has(8n) && !kanallar.includes(message.channel.name)) {
      return message.reply({ content: `${kanallar.map(x => `${client.channels.cache.find(chan => chan.name == x)}`)} kanallarında kullanabilirsiniz.` }).then((e) => setTimeout(() => { e.delete(); }, 10000)); 
    }

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    await client.guilds.cache.get(allah.GuildID).members.fetch(member.user.id);

    const category = async (parentsArray) => {
      const data = await voiceUserParent.find({ guildID: message.guild.id, userID: member.user.id });
      const voiceUserParentData = data.filter((x) => parentsArray.includes(x.parentID));
      let voiceStat = 0;
      for (let i = 0; i < voiceUserParentData.length; i++) {  // i <= yerine i < kullanarak dizinin dışına çıkılmamasını sağladım
        voiceStat += voiceUserParentData[i] ? voiceUserParentData[i].parentData : 0;
      }
      return moment.duration(voiceStat).format("H [Saat], m [Dakika] s [Saniye]");
    };

    const messageData = await messageUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const voiceData = await voiceUser.findOne({ guildID: message.guild.id, userID: member.user.id });
    const messageWeekly = messageData ? messageData.weeklyStat : 0;
    const messageMonthly = messageData ? messageData.monthlyStat : 0;
    const voiceWeekly = moment.duration(voiceData ? voiceData.weeklyStat : 0).format("H [Saat], m [Dakika]");
    const messageDaily = messageData ? messageData.dailyStat : 0;
    const voiceDaily = moment.duration(voiceData ? voiceData.dailyStat : 0).format("H [Saat], m [Dakika]");

    let nameData = await isimler.findOne({ guildID: message.guild.id, userID: member.id });

    const roles = member.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
    const rolleri = [];
    if (roles.length > 6) {
      const lent = roles.length - 6;
      let itemler = roles.slice(0, 6);
      itemler.map(x => rolleri.push(x));
      rolleri.push(`${lent} daha...`);
    } else {
      roles.map(x => rolleri.push(x));
    }
    const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    const joinPos = members.map((u) => u.id).indexOf(member.id);
    const previous = members[joinPos - 1] ? members[joinPos - 1].user : null;
    const next = members[joinPos + 1] ? members[joinPos + 1].user : null;
    let nickname = member.displayName == member.username ? "" + member.username + " [Yok] " : member.displayName;

    const yazı = [];
    if (member.user.username.length > 15) {
      let westina31 = member.user.username.slice(0, 15);
      yazı.push(`${westina31}...`);  
    } else {
      yazı.push(`${member.user.tag}`);
    }

    const colorMap = {
      0: "#A7F9F9",
      1: "#F6CD46",
      2: "#C1853C",
    };

    // En çok mesaj atılan ve en çok vakit geçirilen kanalları bulma fonksiyonu
    const topChannels = messageData?.channels
      ? Object.entries(messageData.channels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([channelId, count]) => client.channels.cache.get(channelId)?.name || 'Silinmiş Kanal')
      : [];

    const topVoiceChannels = voiceData?.channels
      ? Object.entries(voiceData.channels)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 5)
          .map(([channelId, time]) => client.channels.cache.get(channelId)?.name || 'Silinmiş Kanal')
      : [];

    let topTextChannel = topChannels.length > 0 ? topChannels[0] : "Bulunamadı";
    let topVoiceChannel = topVoiceChannels.length > 0 ? topVoiceChannels[0] : "Bulunamadı";
    const messageUsersData2 = await messageUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });
    messageUsersData2.sort((a, b) => b.TotalStat - a.TotalStat);
    const index = messageUsersData2.findIndex((x) => x.userID === member.user.id);
    const sıralama = index === -1 ? "Verisi Yok." : `${index + 1}. sırada`; 

    const voiceUsersData2 = await voiceUser.find({ guildID: message.guild.id }).sort({ weeklyStat: -1 });
    voiceUsersData2.sort((a, b) => b.TotalStat - a.TotalStat);
    const index2 = voiceUsersData2.findIndex((x) => x.userID === member.user.id);
    const sıralama2 = index2 === -1 ? "Verisi Yok." : `${index2 + 1}. sırada`;

    const streamData = await StreamerStat.find({ guildID: message.guild.id });
    streamData.sort((a, b) => b.TotalStat - a.TotalStat);
    const index3 = streamData.findIndex((x) => x.userID === member.user.id);
    const sıralama3 = index3 === -1 ? "Verisi Yok." : `${index3 + 1}. sırada`; 

    const cameraData = await CameraStat.find({ guildID: message.guild.id });
    cameraData.sort((a, b) => b.TotalStat - a.TotalStat);
    const index4 = cameraData.findIndex((x) => x.userID === member.user.id);
    const sıralama4 = index4 === -1 ? "Verisi Yok." : `${index4 + 1}. sırada`; 

    let canvas = Canvas.createCanvas(1152, 585),
        ctx = canvas.getContext("2d");

    // Resmin tam yolunu belirtin
    const imagePath = path.resolve(__dirname, "../../../settings/Assets/stat-card.png");

    // Resmi yükleyin
    let background = await Canvas.loadImage(imagePath);

    // Resmi çizin
    ctx.drawImage(background, 0, 0, 1152, 585);

    ctx.font = '40px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    let westinacik = member.user.username;
    ctx.fillText(`${westinacik}`, canvas.width / 10.00, 63);

    ctx.font = '24px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${moment(Date.now()).format("LLL")}`, canvas.width / 1.32, 63);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${sıralama2}`, canvas.width / 5.60, 183);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${sıralama}`, canvas.width / 5.60, 233);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${sıralama3}`, canvas.width / 5.60, 283);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`${sıralama4}`, canvas.width / 5.60, 333);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${messageData ? messageData.topStat : 0} mesaj`, canvas.width / 2.0, 183, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${Number(messageDaily).toLocaleString()} mesaj`, canvas.width / 2.0, 233, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${Number(messageWeekly).toLocaleString()} mesaj`, canvas.width / 2.0, 283, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${moment.duration(voiceData ? voiceData.topStat : 0).format("H [saat], m [dakika]")}`, canvas.width / 1.24, 183, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${voiceDaily}`, canvas.width / 1.24, 233, 200, 400);

    ctx.font = '21px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`${voiceWeekly}`, canvas.width / 1.24, 283, 200, 400);

    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Arkadaş verisi bulunamadı.`, canvas.width / 1.28, 463, 200, 400);

    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Arkadaş verisi bulunamadı.`, canvas.width / 1.28, 515, 200, 400);

    // Canvas'a Yazdırma
    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Metin Kanalı: ${topTextChannel}`, canvas.width / 6.5, 463);

    ctx.font = '23px "DINNextLTPro-Bold"';
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Sesli Kanal: ${topVoiceChannel}`, canvas.width / 6.5, 515);

    let image = await Canvas.loadImage(member.displayAvatarURL({ size: 128, extension: 'png' }));
    ctx.save();
    roundedImage(ctx, 27, 12, 75, 75, 28);
    ctx.clip();
    ctx.drawImage(image, 27, 12, 75, 75);
    ctx.restore();

    let img = canvas.toBuffer('image/png');
    message.reply({ content: ``, files: [img] });
  },
};

// roundedImage fonksiyonu
function roundedImage(ctx, x, y, width, height, radius) {
  if (radius === true) radius = 5;
  if (!radius || typeof radius !== "number") radius = 0;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();

  return ctx;
}
