const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  connectionTimeoutMillis: 30000,
});

async function runSQL(filePath, description) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  console.log(`\n--- 执行: ${description} ---`);
  console.log(`文件: ${filePath}`);
  await pool.query(sql);
  console.log(`完成: ${description}`);
}

async function verifyTables() {
  const result = await pool.query(`
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name IN ('users', 'templates', 'poems', 'poem_versions', 'poem_likes', 'schema_migrations')
    ORDER BY table_name
  `);
  const tables = result.rows.map(r => r.table_name);
  const expected = ['poem_likes', 'poem_versions', 'poems', 'schema_migrations', 'templates', 'users'];
  const allPresent = expected.every(t => tables.includes(t));
  console.log('\n--- 数据库表验证 ---');
  console.log(`存在的表: ${tables.join(', ')}`);
  console.log(allPresent ? '所有预期表均已创建' : '缺少部分表，请检查');

  const templateCount = await pool.query('SELECT COUNT(*) FROM templates');
  console.log(`模板数据条数: ${templateCount.rows[0].count}`);
}

async function main() {
  try {
    console.log('正在连接数据库...');
    console.log(`主机: ${process.env.DB_HOST}`);
    console.log(`数据库: ${process.env.DB_NAME}`);
    await pool.query('SELECT NOW()');
    console.log('数据库连接成功!');

    const dbDir = path.join(__dirname, '..', '..', 'server', 'database');
    const schemaPath = path.join(dbDir, 'schema.sql');
    const seedPath = path.join(dbDir, 'seed.sql');

    if (!fs.existsSync(schemaPath)) {
      console.error(`架构文件不存在: ${schemaPath}`);
      process.exit(1);
    }

    await runSQL(schemaPath, '数据库架构初始化');
    console.log('架构初始化完成!');

    if (fs.existsSync(seedPath)) {
      await runSQL(seedPath, '种子数据插入');
      console.log('种子数据插入完成!');
    } else {
      console.log('种子文件不存在，跳过种子数据插入');
    }

    await verifyTables();

    console.log('\n数据库初始化全部完成!');
  } catch (err) {
    console.error('数据库初始化失败:', err.message);
    if (err.code) {
      console.error('错误代码:', err.code);
    }
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
