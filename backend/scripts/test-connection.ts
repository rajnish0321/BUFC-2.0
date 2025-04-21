import { testDatabaseConnection } from '../lib/test-db';

async function main() {
  console.log('Starting database connection test...');
  const success = await testDatabaseConnection();
  console.log('\nTest summary:', success ? '✅ Tests completed' : '❌ Tests failed');
  process.exit(success ? 0 : 1);
}

main(); 