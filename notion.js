const { Client } = require('@notionhq/client')
const fs = require('fs')

const notion = new Client ({ auth: process.env.NOTION_TOKEN })

const getMedicines = async ({nameFilter} = {}) => {
    const query = {
        database_id: process.env.NOTION_DATABASE_ID,
    }

    if (nameFilter){
        query.filter = {
            property: 'Name',
            rich_text: {
                equals: nameFilter
            }
        }
    }

    const { results } = await notion.databases.query(query)

    //import in json the results with fs, whit that you know the format of the data with notion and you can map it
    //fs.writeFileSync('./data.json', JSON.stringify(results, null, 2));

    return results.map(page => {
        const { properties } = page
        const { Name, Etiquetas, Description, ImageUrl, Price, DateTime } = properties

        return {
            name: Name.title[0].plain_text,
            description: Description.rich_text[0].plain_text,
            price: Price.number,
            imageUrl: ImageUrl.files[0].file.url,
            tags: Etiquetas.multi_select.map(tag => tag.name),
            date: DateTime.last_edited_time
        }
    });
}

//export module
module.exports = { getMedicines };

//to get information from the database and connect
/*async function getDatabase() {
    const response = await 
    notion.databases.retrieve({ database_id: process.env.NOTION_DATABASE_ID })
    console.log(response)
}

getDatabase()*/