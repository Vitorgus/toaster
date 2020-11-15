const Discord = require('discord.js')
const { EventEmitter } = require('events')

/**
 * @callback IgnoreMemberFunction
 * @param {Discord.GuildMember} member The member to check
 * @returns {boolean} Whether the member should be ignored
 */

/**
 * @callback IgnoreRoleFunction
 * @param {Discord.Collection<Discord.Snowflake, Discord.Role>} role The role to check
 * @returns {boolean} Whether the user should be ignored
 */

/**
 * @callback IgnoreGuildFunction
 * @param {Discord.Guild} guild The guild to check
 * @returns {boolean} Whether the guild should be ignored
 */

/**
 * @callback IgnoreChannelFunction
 * @param {Discord.Channel} channel The channel to check
 * @returns {boolean} Whether the channel should be ignored
 */

/**
 * Emitted when a member gets warned.
 * @event AntiSpamClient#warnAdd
 * @property {Discord.GuildMember} member The member that was warned.
 */

/**
 * Emitted when a member gets kicked.
 * @event AntiSpamClient#kickAdd
 * @property {Discord.GuildMember} member The member that was kicked.
 */

/**
 * Emitted when a member gets muted.
 * @event AntiSpamClient#muteAdd
 * @property {Discord.GuildMember} member The member that was muted.
 */

/**
 * Emitted when a member gets banned.
 * @event AntiSpamClient#warnAdd
 * @property {Discord.GuildMember} member The member that was banned.
 */

/**
 * Options for the AntiSpam client
 * @typedef AntiSpamClientOptions
 *
 * @property {number} [warnThreshold=3] Amount of messages sent in a row that will cause a warning.
 * @property {number} [kickThreshold=5] Amount of messages sent in a row that will cause a kick.
 * @property {number} [muteThreshold=7] Amount of messages sent in a row that will cause a mute.
 * @property {number} [banThreshold=4] Amount of messages sent in a row that will cause a ban.
 *
 * @property {number} [maxInterval=2000] Amount of time (ms) in which messages are considered spam.
 * @property {number} [maxDuplicatesInterval=2000] Amount of time (ms) in which duplicate messages are considered spam.
 *
 * @property {number} [maxDuplicatesWarn=3] Amount of duplicate messages that trigger a warning.
 * @property {number} [maxDuplicatesKick=5] Amount of duplicate messages that trigger a kick.
 * @property {number} [maxDuplicatesMute=7] Amount of duplicate messages that trigger a mute.
 * @property {number} [maxDuplicatesBan=10] Amount of duplicate messages that trigger a ban.
 *
 * @property {string|Discord.Snowflake} [muteRoleName='Muted'] Name or ID of the role that will be added to users if they got muted.
 * @property {string|Discord.Snowflake} [modLogsChannelName='mod-logs'] Name or ID of the channel in which moderation logs will be sent.
 * @property {boolean} [modLogsEnabled=false] Whether moderation logs are enabled.
 *
 * @property {string|Discord.MessageEmbed} [warnMessage='{@user}, Please stop spamming.'] Message that will be sent in the channel when someone is warned.
 * @property {string|Discord.MessageEmbed} [kickMessage='**{user_tag}** has been muted for spamming.'] Message that will be sent in the channel when someone is kicked.
 * @property {string|Discord.MessageEmbed} [muteMessage='**{user_tag}** has been kicked for spamming.'] Message that will be sent in the channel when someone is muted.
 * @property {string|Discord.MessageEmbed} [banMessage='**{user_tag}** has been banned for spamming.'] Message that will be sent in the channel when someone is banned.
 *
 * @property {boolean} [errorMessages=true] Whether the bot should send a message in the channel when it doesn't have some required permissions, like it can't kick members.
 * @property {string} [kickErrorMessage='Could not kick **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to kick the member.
 * @property {string} [muteErrorMessage='Could not ban **{user_tag}** because of improper permissions.'] Message that will be sent in the channel when the bot doesn't have enough permissions to mute the member (to add the mute role).
 * @property {string} [banErrorMessage='Could not mute **{user_tag}** because of improper permissions or the mute role couldn\'t be found.'] Message that will be sent in the channel when the bot doesn't have enough permissions to ban the member.
 *
 * @property {Discord.Snowflake|string[]|IgnoreMemberFunction} [ignoredMembers=[]] Array of member IDs that are ignored.
 * @property {Discord.Snowflake|string[]|IgnoreRoleFunction} [ignoredRoles=[]] Array of role IDs or role names that are ignored. Members with one of these roles will be ignored.
 * @property {Discord.Snowflake|string[]|IgnoreGuildFunction} [ignoredGuilds=[]] Array of guild IDs or guild names that are ignored.
 * @property {Discord.Snowflake|string[]|IgnoreChannelFunction} [ignoredChannels=[]] Array of channel IDs or channel names that are ignored.
 * @property {Discord.PermissionString[]} [ignoredPermissions=[]] Users with at least one of these permissions will be ignored.
 * @property {boolean} [ignoreBots=true] Whether bots should be ignored.
 *
 * @property {boolean} [warnEnabled=true] Whether warn sanction is enabled.
 * @property {boolean} [kickEnabled=true] Whether kick sanction is enabled.
 * @property {boolean} [muteEnabled=true] Whether mute sanction is enabled.
 * @property {boolean} [banEnabled=true] Whether ban sanction is enabled.
 *
 * @property {number} [deleteMessagesAfterBanForPastDays=1] When a user is banned, their messages sent in the last x days will be deleted.
 * @property {boolean} [verbose=false] Extended logs from module (recommended).
 * @property {boolean} [debug=false] Whether to run the module in debug mode.
 * @property {boolean} [removeMessages=true] Whether to delete user messages after a sanction.
 */

/**
 * Cached message.
 * @typedef CachedMessage
 *
 * @property {Discord.Snowflake} messageID The ID of the message.
 * @property {Discord.Snowflake} guildID The ID of the guild where the message was sent.
 * @property {Discord.Snowflake} authorID The ID of the author of the message.
 * @property {Discord.Snowflake} channelID The ID of the channel of the message.
 * @property {string} content The content of the message.
 * @property {number} sentTimestamp The timestamp the message was sent.
 */

/**
 * Cache data for the AntiSpamClient
 * @typedef AntiSpamCache
 *
 * @property {Discord.Snowflake[]} warnedUsers Array of warned users.
 * @property {Discord.Snowflake[]} kickedUsers Array of kicked users.
 * @property {Discord.Snowflake[]} mutedUsers Array of muted users.
 * @property {Discord.Snowflake[]} bannedUsers Array of banned users.
 * @property {CachedMessage[]} messages Array of cached messages, used to detect spam.
 */

/**
 * Main AntiSpam class
 */
class AntiSpamClient extends EventEmitter {
	/**
     * @param {AntiSpamClientOptions} options The options for this AntiSpam client instance
     */
	constructor (options) {
		super()
		/**
		 * The default options for the AntiSpam
		 * @type {AntiSpamClientOptions}
		 */
        const defaultOptions = {

			warnThreshold: 3,
			kickThreshold: 5,
			banThreshold: 7,
			muteThreshold: 4,

			maxInterval: 2000,
			maxDuplicatesInterval: 2000,

			maxDuplicatesWarn: 7,
			maxDuplicatesKick: 10,
			maxDuplicatesBan: 10,
			maxDuplicatesMute: 9,

			muteRoleName: 'Muted',

			modLogsChannelName: 'mod-logs',
			modLogsEnabled: false,

			warnMessage: '{@user}, Please stop spamming.',
			muteMessage: '**{user_tag}** has been muted for spamming.',
			kickMessage: '**{user_tag}** has been kicked for spamming.',
			banMessage: '**{user_tag}** has been banned for spamming.',

			errorMessages: true,
			kickErrorMessage: 'Could not kick **{user_tag}** because of improper permissions.',
			banErrorMessage: 'Could not ban **{user_tag}** because of improper permissions.',
			muteErrorMessage: 'Could not mute **{user_tag}** because of improper permissions or the mute role couldn\'t be found.',

			ignoredMembers: [],
			ignoredRoles: [],
			ignoredGuilds: [],
			ignoredChannels: [],
			ignoredPermissions: [],
			ignoreBots: true,

			warnEnabled: true,
			kickEnabled:  true,
			muteEnabled: true,
			banEnabled: true,

			deleteMessagesAfterBanForPastDays: 1,
			verbose: false,
			debug:  false,
			removeMessages: true
		}
        /**
		 * The actual options for this AntiSpam client instance
		 * @type {AntiSpamClientOptions}
		 */
        this.options = {
            ...defaultOptions,
            ...options
        }

		/**
		 * The cache for this AntiSpam client instance
		 * @type {AntiSpamCache}
		 */
		this.cache = {
			messages: new Discord.Collection(),
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: []
		}
	}

	/**
	 * Format a string and returns it.
	 * @ignore
	 * @param {string|Discord.MessageEmbed} string The string to format.
	 * @param {Discord.Message} message Context message.
	 * @returns {string|Discord.MessageEmbed}
	 */
	format (string, message) {
		if (typeof string === 'string') {
			return string
				.replace(/{@user}/g, message.author.toString())
				.replace(/{user_tag}/g, message.author.tag)
				.replace(/{server_name}/g, message.guild.name)
		} else {
			const embed = new Discord.MessageEmbed(string)
			if (embed.description) embed.setDescription(this.format(embed.description, message))
			if (embed.title) embed.setTitle(this.format(embed.title, message))
			if (embed.footer && embed.footer.text) embed.footer.text = this.format(embed.footer.text, message)
			if (embed.author && embed.author.name) embed.author.name = this.format(embed.author.name, message)
			return embed
		}
	}

	/**
	 * Send a message to the logs channel
	 * @ignore
	 * @param {string} message The message to log
	 * @param {Discord.Client} client The Discord client that will send the message
	 */
	log (message, client) {
		if (this.options.modLogsEnabled) {
			const modLogChannel = client.channels.resolve(this.options.modLogsChannelName);
			if (modLogChannel) {
				modLogChannel.send(message);
			}
		}
	}

	/**
	 * Delete spam messages
	 * @ignore
	 * @param {CachedMessage[]} messages The messages to delete
	 * @param {Discord.Client} client The Discord client that will delete the messages
	 * @returns {Promise<void>}
	 */
	async clearSpamMessages (messages, client) {
		messages.forEach((message) => {
			const channel = client.channels.cache.get(message.channelID)
			if (channel) {
				const msg = channel.messages.cache.get(message.messageID)
				if (msg && msg.deletable) msg.delete()
			}
		})
	}

	/**
	 * Ban a user.
	 * @ignore
	 * @param {Discord.Message} message Context message.
	 * @param {Discord.GuildMember} member The member to ban.
	 * @param {CachedMessage[]} [spamMessages] The spam messages.
	 * @returns {Promise<boolean>} Whether the member could be banned.
	 */
	async banUser (message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.messages.get(message.guild.id).delete(message.author.id);
		this.cache.bannedUsers.push(message.author.id)
		if (!member.bannable) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (banUser#userNotBannable): ${message.author.tag} (ID: ${message.author.id}) could not be banned, insufficient permissions`)
			}
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.banErrorMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (banUser#sendMissingPermMessage): ${e.message}`)
					}
				})
			}
			return false
		} else {
			await message.member.ban({
				reason: 'Spamming!',
				days: this.options.deleteMessagesAfterBanForPastDays
			})
			if (this.options.banMessage) {
				message.channel.send(this.format(this.options.banMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (banUser#sendSuccessMessage): ${e.message}`)
					}
				})
			}
			if (this.options.modLogsEnabled) {
				this.log(`Spam detected: ${message.author.tag} got **banned**`, message.client)
			}
			this.emit('banAdd', member)
			return true
		}
	}

	/**
	 * Mute a user.
	 * @ignore
	 * @param {Discord.Message} message Context message.
	 * @param {Discord.GuildMember} member The member to mute.
	 * @param {CachedMessage[]} [spamMessages] The spam messages.
	 * @returns {Promise<boolean>} Whether the member could be muted.
	 */
	async muteUser (message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.messages.get(message.guild.id).delete(message.author.id);
		this.cache.mutedUsers.push(message.author.id)
		const role = message.guild.roles.cache.find(role => role.name === this.options.muteRoleName)
		const userCanBeMuted = role && message.guild.me.hasPermission('MANAGE_ROLES') && (message.guild.me.roles.highest.position > message.member.roles.highest.position)
		if (!userCanBeMuted) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (kickUser#userNotMutable): ${message.author.tag} (ID: ${message.author.id}) could not be muted, improper permissions or the mute role couldn't be found.`)
			}
			if (this.options.errorMessages) {
				await message.channel
					.send(this.format(this.options.muteErrorMessage, message))
					.catch((e) => {
						if (this.options.verbose) {
							console.log(`DAntiSpam (muteUser#sendMissingPermMessage): ${e.message}`)
						}
					})
			}
			return false
		}
		if (message.member.roles.cache.has(role.id)) return true
		await message.member.roles.add(role, 'Spamming')
		if (this.options.muteMessage) {
			await message.channel.send(this.format(this.options.muteMessage, message)).catch(e => {
				if (this.options.verbose) {
					console.error(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`)
				}
			})
		}
		if (this.options.modLogsEnabled) {
			this.log(`Spam detected: ${message.author.tag} got **muted**`, message.client)
		}
		this.emit('muteAdd', member)
		return true
	}

	/**
	 * Kick a user.
	 * @ignore
	 * @param {Discord.Message} message Context message.
	 * @param {Discord.GuildMember} member The member to kick.
	 * @param {CachedMessage[]} [spamMessages] The spam messages.
	 * @returns {Promise<boolean>} Whether the member could be kicked.
	 */
	async kickUser (message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.messages.get(message.guild.id).delete(message.author.id);
		this.cache.kickedUsers.push(message.author.id)
		if (!member.kickable) {
			if (this.options.verbose) {
				console.log(`DAntiSpam (kickUser#userNotKickable): ${message.author.tag} (ID: ${message.author.id}) could not be kicked, insufficient permissions`)
			}
			if (this.options.errorMessages) {
				message.channel.send(this.format(this.options.kickErrorMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendMissingPermMessage): ${e.message}`)
					}
				})
			}
			return false
		} else {
			await message.member.kick('Spamming!')
			if (this.options.kickMessage) {
				message.channel.send(this.format(this.options.kickMessage, message)).catch((e) => {
					if (this.options.verbose) {
						console.error(`DAntiSpam (kickUser#sendSuccessMessage): ${e.message}`)
					}
				})
			}
			if (this.options.modLogsEnabled) {
				this.log(`Spam detected: ${message.author.tag} got **kicked**`, message.client)
			}
			this.emit('kickAdd', member)
			return true
		}
	}

	/**
	 * Warn a user.
	 * @ignore
	 * @param {Discord.Message} message Context message.
	 * @param {Discord.GuildMember} member The member to warn.
	 * @param {CachedMessage[]} [spamMessages] The spam messages.
	 * @returns {Promise<boolean>} Whether the member could be warned.
	 */
	async warnUser (message, member, spamMessages) {
		if (this.options.removeMessages && spamMessages) {
			this.clearSpamMessages(spamMessages, message.client)
		}
		this.cache.warnedUsers.push(message.author.id)
		this.log(`Spam detected: ${message.author.tag} got **warned**`, message.client)
		if (this.options.warnMessage) {
			message.channel.send(this.format(this.options.warnMessage, message)).catch((e) => {
				if (this.options.verbose) {
					console.error(`DAntiSpam (warnUser#sendSuccessMessage): ${e.message}`)
				}
			})
		}
		this.emit('warnAdd', member)
		return true
	}

	/**
	 * Checks a message.
	 * @param {Discord.Message} message The message to check.
	 * @returns {Promise<boolean>} Whether the message has triggered a threshold.
	 * @example
	 * client.on('message', (msg) => {
	 * 	antiSpam.message(msg);
	 * });
	 */
	message (message) {
		const { options } = this

		if (
			!message.guild ||
			message.author.id === message.client.user.id ||
			(message.guild.ownerID === message.author.id && !options.debug) ||
			(options.ignoreBots && message.author.bot)
		) {
			return false
		}

		const isMemberIgnored = typeof options.ignoredMembers === 'function' ? options.ignoredMembers(message.member) : options.ignoredMembers.includes(message.author.id)
		if (isMemberIgnored) return false

		const isGuildIgnored = typeof options.ignoredGuilds === 'function' ? options.ignoredGuilds(message.guild) : options.ignoredGuilds.includes(message.guild.id)
		if (isGuildIgnored) return false

		const isChannelIgnored = typeof options.ignoredChannels === 'function' ? options.ignoredChannels(message.channel) : options.ignoredChannels.includes(message.channel.id)
		if (isChannelIgnored) return false

		// const member = message.member || await message.guild.members.fetch(message.author)

		const member = message.member

		const memberHasIgnoredRoles = typeof options.ignoredRoles === 'function'
			? options.ignoredRoles(member.roles.cache)
			: options.ignoredRoles.some((r) => member.roles.cache.has(r))
		if (memberHasIgnoredRoles) return false

		if (options.ignoredPermissions.some((permission) => member.hasPermission(permission))) return false

		const currentMessage = {
			messageID: message.id,
			guildID: message.guild.id,
			authorID: message.author.id,
			channelID: message.channel.id,
			content: message.content,
			sentTimestamp: message.createdTimestamp
		}

		if (!this.cache.messages.has(message.guild.id)) this.cache.messages.set(message.guild.id, new Discord.Collection());
		const guild_cache = this.cache.messages.get(message.guild.id);
		if (!guild_cache.has(message.author.id)) guild_cache.set(message.author.id, []);
		guild_cache.get(message.author.id).push(currentMessage);

		const cachedMessages = guild_cache.get(message.author.id);

		const duplicateMatches = cachedMessages.filter((m) => m.content === message.content && (m.sentTimestamp > (currentMessage.sentTimestamp - options.maxDuplicatesInterval)))

		/**
		 * Duplicate messages sent before the threshold is triggered
		 * @type {CachedMessage[]}
		 */
		const spamOtherDuplicates = []
        if (this.options.removeMessages) {
            if (duplicateMatches.length > 0) {
                let rowBroken = false
                cachedMessages.sort((a, b) => b.sentTimestamp - a.sentTimestamp).forEach(element => {
                    if (rowBroken) return
                    if (element.content !== duplicateMatches[0].content) rowBroken = true
                    else spamOtherDuplicates.push(element)
                })
            }
        }

		const spamMatches = cachedMessages.filter((m) => m.sentTimestamp > (Date.now() - options.maxInterval))

		// let sanctioned = false

        const spamScore = spamMatches.length;
        const duplicateScore = duplicateMatches.length;

		const userCanBeBanned = options.banEnabled && !this.cache.bannedUsers.includes(message.author.id)
		if (userCanBeBanned && (spamScore >= options.banThreshold)) {
			this.banUser(message, member, spamMatches)
			return true
		} else if (userCanBeBanned && (duplicateScore >= options.maxDuplicatesBan)) {
			this.banUser(message, member, [...duplicateMatches, ...spamOtherDuplicates])
			return true
		}

		const userCanBeMuted = options.muteEnabled && !this.cache.mutedUsers.includes(message.author.id)
		if (userCanBeMuted && (spamScore >= options.muteThreshold)) {
			this.muteUser(message, member, spamMatches)
			return true
		} else if (userCanBeMuted && (duplicateScore >= options.maxDuplicatesMute)) {
			this.muteUser(message, member, [...duplicateMatches, ...spamOtherDuplicates])
			return true
		}

		const userCanBeKicked = options.kickEnabled && !this.cache.kickedUsers.includes(message.author.id)
		if (userCanBeKicked && (spamScore >= options.kickThreshold)) {
			this.kickUser(message, member, spamMatches)
			return true
		} else if (userCanBeKicked && (duplicateScore >= options.maxDuplicatesKick)) {
			this.kickUser(message, member, [...duplicateMatches, ...spamOtherDuplicates])
			return true
		}

		const userCanBeWarned = options.warnEnabled && !this.cache.warnedUsers.includes(message.author.id)
		if (userCanBeWarned && (spamScore >= options.warnThreshold)) {
			this.warnUser(message, member, spamMatches)
			return true
		} else if (userCanBeWarned && (duplicateScore >= options.maxDuplicatesWarn)) {
			this.warnUser(message, member, [...duplicateMatches, ...spamOtherDuplicates])
			return true
		}

		return false
	}

	/**
	 * Reset the cache of this AntiSpam client instance.
	 */
	reset () {
		this.cache = {
			messages: new Discord.Collection(),
			warnedUsers: [],
			kickedUsers: [],
			mutedUsers: [],
			bannedUsers: []
		}
	}
}

module.exports = AntiSpamClient
