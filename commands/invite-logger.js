let wait = require('./sleep')

async function inviteLogger(client) {
    let invites = {}
    
    client.on('ready', async() => {
        await wait(2000);
    
        client.guilds.cache.forEach(g => {
            g.invites.fetch().then(inv => {
                invites[g.id] = inv
            })
        })
    })
    
    client.on('guildMemberAdd', async member => {
        try {
            if (member.user.bot) return
            member.guild.invites.fetch().then(async guildInvites => {
            const ei = invites[member.guild.id];
                    // Update the cached invites for the guild.
                    invites[member.guild.id] = guildInvites;
                    if (!ei) return;
                    //  Look through the invites, find the one for which the uses went up.
                    await member.guild.invites.fetch().catch(() => undefined);
                    const invite = guildInvites.find(i => {
                        let a = ei.get(i.code);
                        if (!a) a = 'Vanity Url';
                        return a
                    });
                    if (!invite) return;
                    let inviter = client.users.cache.get(invite.inviter.id);
                    if (!inviter) inviter = 'Vanity Url No Inviter'
                    client.emit("inviteLogger", member, invite, inviter)
        });
        } 
        catch { (e) }
     })
    }

module.exports = inviteLogger;