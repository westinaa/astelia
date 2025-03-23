const { PermissionsBitField, EmbedBuilder, Client, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const ayar = require("../../../settings/configs/sunucuayar.json")
const conf = require("../../../settings/configs/sunucuayar.json")
const { red, green } = require("../../../settings/configs/emojis.json")
const moment = require("moment")
moment.locale("tr")

module.exports = {
  conf: {
    aliases: ["kayıtsız","ks","kayitsiz","unregister","unreg"],
    name: "kayitsiz",
    help: "kayitsiz  <Rol/ID>",
    category: "kayıt",
  },
  
  run: async (client, message, args, embed, prefix) => { 
    if(!ayar.teyitciRolleri.some(rol => message.member.roles.cache.has(rol)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 

    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Yeterli yetkin yok!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!member) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Bir üye belirtmelisin!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator) && member.roles.highest.position >= message.member.roles.highest.position) 
    {
    message.react(red) 
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Kendinle aynı yetkide ya da daha yetkili olan birini kayıtsıza atamazsınin!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    if (!member.manageable) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Bu üyeyi kayıtsıza atamıyorum!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000)); 
    return }
    message.react(green)
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])

 const logEmbed = new EmbedBuilder()
    .setColor("#ffffff")
    .setAuthor({ name: uye.user.tag, iconURL: uye.displayAvatarURL({ dynamic: true }) })
    .setDescription(`${uye} kullanıcısı ${message.member} tarafından \`kayıtsız\` atıldı
    
    > Kayıtsıza Atılan Üye ${uye.toString()} \n> Kayıtsıza Atan Yetkili ${message.member.toString()} \n> Atılma zamanı <t:${Math.floor(Date.now() / 1000)}:R>`)
  if (client.channels.cache.find(c => c.name === "kayıtsız_log")) client.channels.cache.find(c => c.name === "kayıtsız_log").send({ embeds: [logEmbed] })


    member.roles.set(conf.unregRoles);
    member.setNickname(`・Kayıtsız `)
    // member.setNickname(`${member.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} İsim `)
    message.react(green)
    let westina = new EmbedBuilder()
.setDescription(`${member} üyesi ${message.author} tarafından kayıtsıza atıldı! ${green}`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
message.reply({ embeds: [westina] })
   
  


  },
};