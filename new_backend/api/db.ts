const getDatabase = async () => {
    var knex = require('knex')
    
    const db_conn = await knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
    })

    const usersExists = await db_conn.schema.hasTable('users');
    const accountsExists = await db_conn.schema.hasTable('accounts');
    const offersExists = await db_conn.schema.hasTable('offers');
    
    // Define schema
    if(!usersExists){
        await db_conn.schema.createTable('users', (table) => {
            table.increments('id');
            table.string('name');
            table.string('password');
        }).catch(e => console.error(e))
    }
    
    if(!accountsExists){
        await db_conn.schema.createTable('accounts', (table) => {
            table.increments('id');
            table.string('username');
            table.string('password');
            table.timestamp('last_checked');
        }).catch(e => console.error(e))
    }
    
    if(!offersExists){
        await db_conn.schema.createTable('offers', (table) => {
            table.increments('id').unsigned();
    
            table.integer('offerid').unsigned();
            table.integer('propositionid').unsigned();
            
            table.string('title');
            table.string('description');
            table.string('image');
            table.string('offerbucket')
    
            table.integer('accountid').unsigned();
            table.foreign('accountid').references('accounts.id')
            
            table.timestamp('expires');
    
            table.timestamps();
        }).catch(e => console.error(e))
    }
    return db_conn
};

export default getDatabase;