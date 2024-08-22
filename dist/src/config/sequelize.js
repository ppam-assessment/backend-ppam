const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'mysql'
});
const Status = {
    admin: 'admin',
    submitter: 'submitter',
    viewer: 'viewer'
};
const InstrumentType = {
    dropdown: 'dropdown',
    dropdownya: 'dropdownya',
    dropdownideal: 'dropdownideal',
    checkbox: 'checkbox',
    text: 'text',
    date: 'date',
    sub: 'sub'
};
const AreaType = {
    nasional: 'nasional',
    subnasional: 'subnasional'
};
const Users = sequelize.define('Users', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    username: {
        type: DataTypes.STRING
    },
    institute: {
        type: DataTypes.STRING
    },
    password: {
        type: DataTypes.STRING
    },
    email: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM,
        values: Object.values(Status)
    }
});
const Areas = sequelize.define('Areas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM,
        values: Object.values(AreaType)
    }
});
const Topics = sequelize.define('Topics', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    topic: {
        type: DataTypes.STRING
    },
    part: {
        type: DataTypes.INTEGER
    }
});
const General = sequelize.define('General', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    }
});
const Instrument = sequelize.define('Instrument', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    mainId: {
        type: DataTypes.INTEGER
    },
    number: {
        type: DataTypes.INTEGER
    },
    topicId: {
        type: DataTypes.INTEGER
    },
    question: {
        type: DataTypes.STRING
    },
    type: {
        type: DataTypes.ENUM,
        values: Object.values(InstrumentType)
    }
});
const Choices = sequelize.define('Choices', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    instrumentId: {
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
});
const Responses = sequelize.define('Responses', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userId: {
        type: DataTypes.STRING
    },
    instrumentId: {
        type: DataTypes.INTEGER
    },
    value: {
        type: DataTypes.STRING
    },
    score: {
        type: DataTypes.INTEGER
    },
    comment: {
        type: DataTypes.STRING
    }
});
const Sessions = sequelize.define('Sessions', {
    id: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userId: {
        type: DataTypes.STRING
    },
    token: {
        type: DataTypes.STRING
    },
    exp: {
        type: DataTypes.DATE
    }
});
Users.hasMany(Sessions, { foreignKey: 'userId' });
Users.hasMany(Responses, { foreignKey: 'userId' });
Areas.hasMany(Users, { foreignKey: 'areaId' });
Topics.hasMany(Instrument, { foreignKey: 'topicId' });
Instrument.belongsTo(Topics, { foreignKey: 'topicId' });
Instrument.hasMany(Choices, { foreignKey: 'instrumentId' });
Instrument.hasMany(Responses, { foreignKey: 'instrumentId' });
Instrument.belongsTo(Instrument, { foreignKey: 'mainId', as: 'main' });
Instrument.hasMany(Instrument, { foreignKey: 'mainId', as: 'sub' });
Choices.belongsTo(Instrument, { foreignKey: 'instrumentId' });
Responses.belongsTo(Instrument, { foreignKey: 'instrumentId' });
Responses.belongsTo(Users, { foreignKey: 'userId' });
Sessions.belongsTo(Users, { foreignKey: 'userId' });
module.exports = {
    sequelize,
    Users,
    Areas,
    Topics,
    General,
    Instrument,
    Choices,
    Responses,
    Sessions
};
export {};
