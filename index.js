/** 
 * ORIGINALY BY : github.com/LoL-Human
 * RECODE BY : LINDOW & MEGA & FAZONE
 **/

const { 
  WAConnection,
  MessageType,
  Presence, 
  MessageOptions,
  Mimetype,
  WALocationMessage,
  WA_MESSAGE_STUB_TYPES,
  ReconnectMode,
  ProxyAgent,
  GroupSettingChange,
  ChatModification,
  waChatKey,
  WA_DEFAULT_EPHEMERAL,
  mentionedJid,
  processTime
} = require("@adiwajshing/baileys")
const moment = require("moment-timezone");


const chalk = require('chalk');
const request = require('request');
const fs = require('fs');
const { exec } = require('child_process');
const ffmpeg = require('fluent-ffmpeg');

const fetch = require('node-fetch');
const { fetchJson } = require('./lib/fetcher')

const conn = require("./lib/connect")
const msg = require("./lib/message")
const wa = require("./lib/wa")
const Exif = require('./lib/exif');
const exif = new Exif();


// Databases

conn.connect()
const megayaa = conn.megayaa

const sleep = async (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}


prefix = '!'
hit_today = []

megayaa.on('CB:action,,call', async json => {
    const callerId = json[2][0][1].from;
    console.log("ligar para bot "+ callerId)
        megayaa.sendMessage(callerId, "Sistema de bloqueio automático, não ligue, por favor", MessageType.text)
        await sleep(4000)
        await megayaa.blockUser(callerId, "add") // Block user
})

megayaa.on('group-participants-update', async(chat) => {
    try {
        var member = chat.participants
        for (var x of member) {
            try {
                if (x == megayaa.user.jid) return
                var photo = await wa.getPictProfile(x)
                var username = await wa.getUserName(x) || "Guest"
                var from = chat.jid
                var group = await megayaa.groupMetadata(from)
                if (chat.action == 'add' && public) {
                     text = `ᴏʟᴀ @${username}👋\nʙᴇᴍ ᴠɪɴᴅᴏ ᴀᴏ ɢʀᴜᴘᴏ *${group.subject}*\n ────────────────

ᴅɪɢɪᴛᴇ ${prefix}help ᴘᴀʀᴀ ᴄᴏᴍᴇᴄᴀʀ ᴀ ᴜsᴀʀ  ʙᴏᴛ`
                        wa.sendImage(from, photo, text)
                }
                if (chat.action == 'remove' && public) {
                    text = `${username}, Sayonara 👋`
                    await wa.sendMessage(from, text)
                }
            } catch {
                continue
            }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  ERRO  ]"), chalk.keyword("red")(e))
    }
})

megayaa.on('chat-update', async(lin) => {
    try {
        if (!lin.hasNewMessage) return
        if (!lin.messages) return
        if (lin.key && lin.key.remoteJid == 'status@broadcast') return
        lin = lin.messages.all()[0]
        if (!lin.message) return
        const from = lin.key.remoteJid
        const type = Object.keys(lin.message)[0]
        const { text, extendedText, contact, location, liveLocation, image, video, sticker, document, audio, product } = MessageType
        const quoted = type == 'extendedTextMessage' && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.quotedMessage || [] : []
        const typeQuoted = Object.keys(quoted)[0]
        const body = lin.message.conversation || lin.message[type].caption || lin.message[type].text || ""
        chats = (type === 'conversation') ? lin.message.conversation : (type === 'extendedTextMessage') ? lin.message.extendedTextMessage.text : ''
        budy = (type === 'conversation' && lin.message.conversation.startsWith(prefix)) ? lin.message.conversation : (type == 'imageMessage') && lin.message.imageMessage.caption.startsWith(prefix) ? lin.message.imageMessage.caption : (type == 'videoMessage') && lin.message.videoMessage.caption.startsWith(prefix) ? lin.message.videoMessage.caption : (type == 'extendedTextMessage') && lin.message.extendedTextMessage.text.startsWith(prefix) ? lin.message.extendedTextMessage.text : ''

        if (prefix != "") {
            if (!body.startsWith(prefix)) {
                cmd = false
                comm = ""
            } else {
                cmd = true
                comm = body.slice(1).trim().split(" ").shift().toLowerCase()
            }
        } else {
            cmd = false
            comm = body.trim().split(" ").shift().toLowerCase()
        }

        const reply = async(teks) => {
            await megayaa.sendMessage(from, teks, MessageType.text, { quoted: lin })
        }
	const uploadImages = (filePath) => {
			return new Promise(async (resolve, reject) => {
            const fileData = fs.readFileSync(filePath)
            const form = new FormData()
            form.append('file', fileData, 'tmp.png')
            fetch('https://telegra.ph/upload', {
                method: 'POST',
                body: form
            })
                .then(res => res.json())
                .then(res => {
                    if (res.error) return reject(res.error)
                    resolve('https://telegra.ph' + res[0].src)
                })
                .then(() => fs.unlinkSync(filePath))
                .catch(err => reject(err))
			})
			}

        const command = comm
        hit_today.push(command)
        const args = body.trim().split(/ +/).slice(1)
        const isCmd = cmd
        const meNumber = megayaa.user.jid
        const botNumber = megayaa.user.jid.split("@")[0]
        const isGroup = from.endsWith('@g.us')
        const arg = chats.slice(command.length + 1, chats.length)
        const sender = lin.key.fromMe ? megayaa.user.jid : isGroup ? lin.participant : lin.key.remoteJid
        const senderNumber = sender.split("@")[0]
        const groupMetadata = isGroup ? await megayaa.groupMetadata(from) : ''
        const groupName = isGroup ? groupMetadata.subject : ''
        const groupMembers = isGroup ? groupMetadata.participants : ''
        const groupAdmins = isGroup ? await wa.getGroupAdmins(groupMembers) : []
        const isAdmin = groupAdmins.includes(sender) || false
        const botAdmin = groupAdmins.includes(megayaa.user.jid)
        const totalChat = megayaa.chats.all()
        const itsMe = senderNumber == botNumber
        const isOwner = senderNumber == owner || senderNumber == botNumber || mods.includes(senderNumber)
        var pes = (type === 'conversation' && lin.message.conversation) ? lin.message.conversation : (type == 'imageMessage') && lin.message.imageMessage.caption ? lin.message.imageMessage.caption : (type == 'videoMessage') && lin.message.videoMessage.caption ? lin.message.videoMessage.caption : (type == 'extendedTextMessage') && lin.message.extendedTextMessage.text ? lin.message.extendedTextMessage.text : ''
        const msgC = pes.slice(0).trim().split(/ +/).shift().toLowerCase()
        const mentionByTag = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.mentionedJid : []
        const mentionByReply = type == "extendedTextMessage" && lin.message.extendedTextMessage.contextInfo != null ? lin.message.extendedTextMessage.contextInfo.participant || "" : ""
        const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag
        mention != undefined ? mention.push(mentionByReply) : []
        const mentionUser = mention != undefined ? mention.filter(n => n) : []
        const mentions = (teks, memberr, id) => {
	    (id == null || id == undefined || id == false) ? megayaa.sendMessage(from, teks.trim(), extendedText, {contextInfo: {"mentionedJid": memberr}}) : megayaa.sendMessage(from, teks.trim(), extendedText, {quoted: lin, contextInfo: {"mentionedJid": memberr}})
	}
	    	
        

        const isImage = type == 'imageMessage'
        const isVideo = type == 'videoMessage'
        const isAudio = type == 'audioMessage'
        const isSticker = type == 'stickerMessage'
        const isContact = type == 'contactMessage'
        const isLocation = type == 'locationMessage'
        const isMedia = (type === 'imageMessage' || type === 'videoMessage')
        
        typeMessage = body.substr(0, 50).replace(/\n/g, '')
        if (isImage) typeMessage = "Image"
        else if (isVideo) typeMessage = "Video"
        else if (isAudio) typeMessage = "Audio"
        else if (isSticker) typeMessage = "Sticker"
        else if (isContact) typeMessage = "Contact"
        else if (isLocation) typeMessage = "Location"

        const isQuoted = type == 'extendedTextMessage'
        const isQuotedImage = isQuoted && typeQuoted == 'imageMessage'
        const isQuotedVideo = isQuoted && typeQuoted == 'videoMessage'
        const isQuotedAudio = isQuoted && typeQuoted == 'audioMessage'
        const isQuotedSticker = isQuoted && typeQuoted == 'stickerMessage'
        const isQuotedContact = isQuoted && typeQuoted == 'contactMessage'
        const isQuotedLocation = isQuoted && typeQuoted == 'locationMessage'

        if (!public) {
            mods.indexOf(botNumber) === -1 ? mods.push(botNumber) : false
            mods.indexOf(owner) === -1 ? mods.push(owner) : false
            if (!mods.includes(senderNumber)) return
            mods.slice(mods.indexOf(owner), 1)
        }
        
        if (!isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ COMANDO ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber))
        if (isGroup && isCmd) console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[ COMANDO ]"), chalk.whiteBright(typeMessage), chalk.greenBright("from"), chalk.keyword("yellow")(senderNumber), chalk.greenBright("in"), chalk.keyword("yellow")(groupName))
        
   /*
   COMANDOS ONIPOTENTES*/     
   
        if (msgC.includes("bot")) {
				
				if (msgC.includes("bota")) return
				const numM = ['Opa, to on😎', 'Q q vc quer?', 'Oi', 'Qual foi?', 'Opa bb to on🤙']
				const pctM = numM[Math.floor(Math.random() * numM.length)]
				megayaa.updatePresence(from, Presence.composing)
				reply(pctM)
			}
        
       
				
				if (msgC.includes("isMedia")) return
                if (isMedia && !lin.message.videoMessage || isQuotedImage) {
		const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await megayaa.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = 'ANKZIN'
		const author1 = 'BOT'
		exif.create(packname1, author1, `stickwm_${sender}`)
		    await ffmpeg(`${media}`)
		    .input(media)
		    .on('start', function (cmd) {
		        console.log(`Started : ${cmd}`)
		    })
		    .on('erro', function (err) {
		    console.log(`Error : ${err}`)
		fs.unlinkSync(media)
		reply('error2')
		})
		.on('end', function () {
		console.log('Finish')
		exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
	        if (error) return reply('error3')
	        wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)	
		    fs.unlinkSync(`./sticker/${sender}.webp`)	
		    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
		    })
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(`./sticker/${sender}.webp`)
		}  else if ((isMedia && lin.message.videoMessage.fileLength < 10000000 )) {
		const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await megayaa.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = 'ANKZIN'
		const author1 = 'BOT'
		    exif.create(packname1, author1, `stickwm_${sender}`)
		    reply('Perae só um minuto')
		    await ffmpeg(`${media}`)
		        .inputFormat(media.split('.')[4])
			.on('start', function (cmd) {
			console.log(`Started : ${cmd}`)
		    })
		    .on('error', function (err) {
		    console.log(`Error : ${err}`)
		        fs.unlinkSync(media)
			tipe = media.endsWith('.mp4') ? 'video' : 'gif'
			reply('error5')
		    })
		    .on('end', function () {
		    console.log('Finish')
		        exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
			if (error) return reply('error6')
			wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)									
			fs.unlinkSync(media)
			fs.unlinkSync(`./sticker/${sender}.webp`)
			fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
			})
		    })
		    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		    .toFormat('webp')
		    .save(`./sticker/${sender}.webp`)
		}
        
        
        
        
        switch (command) {
            
            case 'sticker':
            case 'fig':
           case 'f':
            case 's':
	        if (isMedia && !lin.message.videoMessage || isQuotedImage) {
		const encmedia = isQuotedImage ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await megayaa.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = 'ANKZIN'
		const author1 = 'BOT'
		exif.create(packname1, author1, `stickwm_${sender}`)
		    await ffmpeg(`${media}`)
		    .input(media)
		    .on('start', function (cmd) {
		        console.log(`Started : ${cmd}`)
		    })
		    .on('error', function (err) {
		    console.log(`Error : ${err}`)
		fs.unlinkSync(media)
		reply('error8')
		})
		.on('end', function () {
		console.log('Finish')
		exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
	        if (error) return reply('Agora não presisa mais usar o *!s*, só envie a foto ou gif de até 5 segundos!')
	        wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)
		    fs.unlinkSync(media)	
		    fs.unlinkSync(`./sticker/${sender}.webp`)	
		    fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
		    })
		})
		.addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		.toFormat('webp')
		.save(`./sticker/${sender}.webp`)
		} else if ((isMedia && lin.message.videoMessage.fileLength < 10000000 || isQuotedVideo && lin.message.extendedTextMessage.contextInfo.quotedMessage.videoMessage.fileLength < 10000000)) {
		const encmedia = isQuotedVideo ? JSON.parse(JSON.stringify(lin).replace('quotedM', 'm')).message.extendedTextMessage.contextInfo : lin
		const media = await megayaa.downloadAndSaveMediaMessage(encmedia, `./sticker/${sender}`)
		const packname1 = 'ANKZIN'
		const author1 = 'BOT'
		    exif.create(packname1, author1, `stickwm_${sender}`)
		    reply('Perae só um minuto')
		    reply('Agora não presisa mais usar o *!s*, só envie a foto ou gif de até 5 segundos!')
		    await ffmpeg(`${media}`)
		        .inputFormat(media.split('.')[4])
			.on('start', function (cmd) {
			console.log(`Started : ${cmd}`)
		    })
		    .on('error', function (err) {
		    console.log(`Error : ${err}`)
		        fs.unlinkSync(media)
			tipe = media.endsWith('.mp4') ? 'video' : 'gif'
			reply('error10')
		    })
		    .on('end', function () {
		    console.log('Finish')
		        exec(`webpmux -set exif ./sticker/stickwm_${sender}.exif ./sticker/${sender}.webp -o ./sticker/${sender}.webp`, async (error) => {
			if (error) return reply('error11')
			wa.sendSticker(from, fs.readFileSync(`./sticker/${sender}.webp`), lin)									
			fs.unlinkSync(media)
			fs.unlinkSync(`./sticker/${sender}.webp`)
			fs.unlinkSync(`./sticker/stickwm_${sender}.exif`)
			})
		    })
		    .addOutputOptions([`-vcodec`,`libwebp`,`-vf`,`scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse`])
		    .toFormat('webp')
		    .save(`./sticker/${sender}.webp`)
		} else {
		reply(`Envie fotos / vídeos com legendas ${prefix}s ou marque imagens / vídeos que foram enviados \ nNota: a duração máxima do vídeo é de 10 segundos`)
	        }
		break
            
            default:
                if (body.startsWith(">")) {
                    if (!itsMe) return await reply('This command only for meguy')
                    return await reply(JSON.stringify(eval(args.join(" ")), null, 2))
                }
        }
    } catch (e) {
        console.log(chalk.whiteBright("├"), chalk.keyword("aqua")("[  ERRO  ]"), chalk.keyword("red")(e))
    }
})
