const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');
const TOKEN = 'Nuh uh'; 
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Role lists and descriptions
let imposterRoles = {
    'Imposter': 'Your the Imposter kill everyone and win.',
    'Imposter2': 'Your the Imposter kill everyone and win.',
    'Stalker': 'The Stalker chooses one person at the start of the game to stalk. If they find out you\'re stalking them, they have to call a meeting and get you voted out.',
    'Vigilante': 'Can only kill while the lights are out, like Batman. Cannot sabotage reactor or O2, only communications.',
    'Door Jammer': 'The Door Jammer can only shut doors and has to close every door on the map at the start of the game and at the start of every round.',
    'Lurker': 'Every time one of the bars on the tasks bar fills you have to lurk in a vent until you kill someone.',
    'Yandere': 'As a Yandere, you are a Stalker. You must choose one person to protect. You cannot harm this person, and your goal is to ensure only you and them remain alive at the end of the game. (if there are 2 imposters than you must follow the other imposter)'
};

let crewmateRoles = {
    'Crewmate': 'Your a Crewmate just do your taskes.',
    'Crewmate3': 'Your a Crewmate just do your taskes.',
    'Workaholic': 'You only do one thing ALL of your tasked then your able to fix lights',
    'ADHD': 'Only do one full task per round',
    'Medium': 'If the Medium finds the body of a player, they will be DM\'d one word. This word cannot be their name, gamertag, or something on their avatar. The ghost can only hint at where the imposter is on the map. (Ghosts must stay at their body unless guardian angle the medium will circle the body to show they are the medium)',
    'Lawyer': 'The Lawyer must complete a specific task to get hired. Once hired, they can view evidence proving someone’s innocence, such as a MedBay scan. During a meeting, they can declare themselves as the Lawyer and present the evidence to confirm the innocence of a player.',
    'Bodyguard': 'The Bodyguard follows one person throughout the entire game. They can only complete tasks if they are in the same room as their client. They are not allowed to report bodies and must vote for whoever their client votes for. If the impostor kills their client, the Bodyguard must be voted out.',
    'Electrician': 'You are the only person to be able to open doors, and fix the lights.',
    'Mute': 'You cannot speak.'
};

// Maps to track role assignments
const userAssignedRoles = new Map();

// Check if role is already assigned
function isRoleAssigned(role) {
    for (let [userId, assignedRole] of userAssignedRoles) {
        if (assignedRole === role) {
            return true;
        }
    }
    return false;
}

client.once('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    await registerCommands();
});

const registerCommands = async () => {
    const commands = [
        new SlashCommandBuilder()
            .setName('imposterroles')
            .setDescription('Replies with a unique Imposter role: Vigilante')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('crewmateroles')
            .setDescription('Replies with a unique Crewmate role')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('resetroles')
            .setDescription('Resets all role assignments (RoleMaster role required)')
            .toJSON(),
        new SlashCommandBuilder()
            .setName('revealroles')
            .setDescription('Reveals the roles assigned to each user (RoleMaster role required)')
            .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(TOKEN);

    try {
        console.log('Registering global slash commands...');
        await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
        console.log('Slash commands registered successfully!');
    } catch (error) {
        console.error('Error registering commands:', error);
    }
};

// Handle commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const userId = interaction.user.id;
    const member = interaction.guild.members.cache.get(userId);

    if (interaction.commandName === 'imposterroles') {
        if (userAssignedRoles.has(userId)) {
            await interaction.reply({
                content: `You already have the role: **${userAssignedRoles.get(userId)}**`,
                ephemeral: true,
            });
            return;
        }

        if (Object.keys(imposterRoles).length === 0) {
            await interaction.reply({
                content: `All Imposter roles have been assigned.`,
                ephemeral: true,
            });
            return;
        }

        // Shuffle roles to randomize selection
        let availableRoles = Object.keys(imposterRoles).filter(role => !isRoleAssigned(role));

        if (availableRoles.length === 0) {
            await interaction.reply({
                content: `No unique Imposter roles are available.`,
                ephemeral: true,
            });
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        const assignedRole = availableRoles[randomIndex];
        const description = imposterRoles[assignedRole];
        userAssignedRoles.set(userId, assignedRole);

        console.log(`${interaction.user.tag} was assigned the role: ${assignedRole}`);

        await interaction.reply({
            content: `Your Imposter role is: **${assignedRole}**\nDescription: ${description}`,
            ephemeral: true,
        });
    }

    if (interaction.commandName === 'crewmateroles') {
        if (userAssignedRoles.has(userId)) {
            await interaction.reply({
                content: `You already have the role: **${userAssignedRoles.get(userId)}**`,
                ephemeral: true,
            });
            return;
        }

        if (Object.keys(crewmateRoles).length === 0) {
            await interaction.reply({
                content: `All Crewmate roles have been assigned.`,
                ephemeral: true,
            });
            return;
        }

        // Shuffle roles to randomize selection
        let availableRoles = Object.keys(crewmateRoles).filter(role => !isRoleAssigned(role));

        if (availableRoles.length === 0) {
            await interaction.reply({
                content: `No unique Crewmate roles are available.`,
                ephemeral: true,
            });
            return;
        }

        const randomIndex = Math.floor(Math.random() * availableRoles.length);
        const assignedRole = availableRoles[randomIndex];
        const description = crewmateRoles[assignedRole];
        userAssignedRoles.set(userId, assignedRole);

        console.log(`${interaction.user.tag} was assigned the role: ${assignedRole}`);

        await interaction.reply({
            content: `Your Crewmate role is: **${assignedRole}**\nDescription: ${description}`,
            ephemeral: true,
        });
    }

    if (interaction.commandName === 'resetroles') {
        if (!member.roles.cache.some(role => role.name === 'RoleMaster')) {
            await interaction.reply({
                content: `You do not have permission to reset roles. Only users with the RoleMaster role can do this.`,
                ephemeral: true,
            });
            return;
        }

        userAssignedRoles.clear();
        console.log(`All roles have been reset.`);
        await interaction.reply({
            content: `All roles have been reset!`,
            ephemeral: false,
        });
    }

    if (interaction.commandName === 'revealroles') {
        if (!member.roles.cache.some(role => role.name === 'RoleMaster')) {
            await interaction.reply({
                content: `You do not have permission to use this command. Only users with the RoleMaster role can do this.`,
                ephemeral: true,
            });
            return;
        }

        const roleList = Array.from(userAssignedRoles.entries())
            .map(([userId, role]) => `<@${userId}>: **${role}**`)
            .join('\n');

        if (!roleList) {
            await interaction.reply({
                content: `No roles have been assigned yet.`,
                ephemeral: true,
            });
            return;
        }

        console.log(`Roles revealed:\n${roleList}`);

        await interaction.reply({
            content: `Here are the roles assigned to each user:\n${roleList}`,
            ephemeral: false,
        });
    }
});

// Log in the bot
client.login(TOKEN);
