﻿const { PermissionsBitField, EmbedBuilder } = require('discord.js');
const ayar = require("../../../settings/configs/sunucuayar.json")
const Ayarlar = require("../../../settings/configs/sunucuayar.json");
const { red , green } = require("../../../settings/configs/emojis.json")
const moment = require("moment")
moment.locale("tr")


module.exports = {
  conf: {
    aliases: ["isim", "i", "nick"],
    name: "isim",
    help: "isim <@westina/ID> <Isim> <Yaş>",
    category: "kayıt",
  },

  run: async (client, message, args, perm, prefix) => {
    let uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!Ayarlar.sahipRolu.some(oku => message.member.roles.cache.has(oku)) && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Yeterli yetkin yok!`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if(!uye) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} \`${prefix}isim <ID> <Isim> <Yaş>\``)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if(message.author.id === uye.id) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Kendi ismini değiştiremezsin. Booster isen \`${prefix}zengin\``)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if(!uye.manageable) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Böyle birisinin ismini değiştiremiyorum`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if(message.member.roles.highest.position <= uye.roles.highest.position) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} Senden yüksek yetkili birisinin ismini değiştiremezsin.`)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    args = args.filter(a => a !== "" && a !== " ").splice(1);
    let setName;
    let isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
    let yaş = args.filter(arg => !isNaN(arg))[0] || "";
    if(!isim && !yaş) 
    {
    message.react(red)
    message.reply({ embeds: [new EmbedBuilder()
      .setColor("#ffffff")
      .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
      .setThumbnail()
      .setDescription(`${red} \`${prefix}isim <ID> <Isim> <Yaş>\``)
      ] }).then((e) => setTimeout(() => { e.delete(); }, 5000));  
    return }
    if(!yaş) 
    //{ setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim}`;
    //} else { setName = `${uye.user.username.includes(ayar.tag) ? ayar.tag : (ayar.ikinciTag ? ayar.ikinciTag : (ayar.tag || ""))} ${isim} | ${yaş}`;
    { setName = `・${isim}`;
  } else { setName = `・${isim} | ${yaş}`;
  } uye.setNickname(`${setName}`).catch(err => message.reply({ content:`İsim çok uzun.`}))

    message.react(green)
let westina = new EmbedBuilder()
.setDescription(`${uye.toString()} üyesinin ismi \`${setName}\` olarak değiştirildi.`)
.setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true }) })
message.reply({ embeds: [westina] })

}   }
