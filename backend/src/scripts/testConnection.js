require('dotenv').config();
const { Sequelize } = require('sequelize');
const path = require('path');

// Debug information
console.log('Current working directory:', process.cwd());
console.log('.env file location:', path.resolve(process.cwd(), '.env'));
console.log('Environment variables loaded:', {
  DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Not set',
  NODE_ENV: process.env.NODE_ENV
});

if (!process.env.DATABASE_URL) {
  console.error('\n❌ Error: DATABASE_URL is not set in environment variables');
  console.error('Please make sure you have a .env file in the backend directory with DATABASE_URL defined');
  console.error('Example .env content:');
  console.error('DATABASE_URL=postgresql://username:password@nozomi.proxy.rlwy.net:10238/railway');
  process.exit(1);
}

console.log('\nTesting database connection...');
console.log('Using Railway.com connection URL');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection has been established successfully.');
    
    // Get detailed database information
    const [results] = await sequelize.query(`
      SELECT 
        current_database() as database,
        current_user as user,
        version() as version,
        current_setting('server_version_num') as version_num
    `);
    
    console.log('\nDatabase Information:');
    console.log(`📁 Database: ${results[0].database}`);
    console.log(`👤 User: ${results[0].user}`);
    console.log(`ℹ️ Version: ${results[0].version}`);
    console.log(`🔢 Version Number: ${results[0].version_num}`);
    
    // Close the connection
    await sequelize.close();
    console.log('\n✅ Connection closed successfully.');
  } catch (error) {
    console.error('\n❌ Unable to connect to the database:');
    console.error('Error details:', error.message);
    if (error.original) {
      console.error('Original error:', error.original.message);
    }
    process.exit(1);
  }
}

testConnection(); 