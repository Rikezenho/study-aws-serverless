// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({ region: 'us-east-1' });

var docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

exports.lambdaHandler = async (event, context) => {
    var body;

    if (event.path == '/categoria') {
        if (event.httpMethod === 'GET') {
            body = await getByCategoria();
        }
    } else if (event.path == '/categoriaScan') {
        if (event.httpMethod === 'GET') {
            body = await getByCategoriaWithScan();
        }
    } else if (event.path == '/hello') {
        if (event.httpMethod === 'POST') {
            body = await createItem();
        }

        if (event.httpMethod === 'GET') {
            body = await getItem();
        }

        if (event.httpMethod === 'DELETE') {
            body = await deleteItem();
        }

        if (event.httpMethod === 'PUT') {
            body = await updateItem();
        }
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(body)
    };

    return response;
};

async function getByCategoriaWithScan() {
    var params = {
        TableName : "PrimeiraTabela",
        ProjectionExpression: "id, nome",
        FilterExpression: "#categoria = :categoria and contains(nome, :nome)",
        ExpressionAttributeNames: {
            "#categoria": "categoria",
        },
        ExpressionAttributeValues: {
            ":categoria": 2,
            ":nome": "Gabriela"
        }
    };

    var body;

    try {
        const data = await docClient.scan(params).promise();
        body = data.Items;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}

async function getByCategoria() {
    var params = {
        TableName : "PrimeiraTabela",
        IndexName: 'categoria-index',
        ProjectionExpression: "id, nome",
        KeyConditionExpression: "#categoria = :categoria",
        FilterExpression: "contains(nome, :nome)",
        ExpressionAttributeNames:{
            "#categoria": "categoria"
        },
        ExpressionAttributeValues: {
            ":categoria": 2,
            ":nome": "Henrique"
        }
    };

    var body;

    try {
        const data = await docClient.query(params).promise();
        body = data.Items;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}

async function updateItem() {
    const params = {
        TableName: 'PrimeiraTabela',
        Key: { 'id': '3' },
        UpdateExpression: 'set nome = :nome, categoria = :categoria',
        ExpressionAttributeValues: {
            ':nome': 'Maria do Carmo',
            ':categoria': 3,
        },
    }

    var body;

    try {
        const data = await docClient.update(params).promise();
        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}

async function deleteItem() {
    const params = {
        TableName: 'PrimeiraTabela',
        Key: { 'id': '3' }
    }

    var body;

    try {
        const data = await docClient.delete(params).promise();
        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}

async function createItem() {
    const params = {
        TableName: 'PrimeiraTabela',
        Item: {
            'id': '3',
            'nome': 'Maria da Silva',
            'categoria': 2
        }
    }

    var body;

    try {
        const data = await docClient.put(params).promise();
        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}

async function getItem() {
    var params = {
        TableName: 'PrimeiraTabela',
        Key: { 'id': '3' }
    };

    var body;

    try {
        const data = await docClient.get(params).promise();
        body = data.Item;
    } catch (err) {
        console.log(err);
        body = err;
    }

    return body;
}