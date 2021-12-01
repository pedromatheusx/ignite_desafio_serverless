import {DynamoDB} from "aws-sdk"

const options = {
    accessKeyId: 'AKID',
    endpoint: 'http://localhost:8000',
  region: 'REGION',
  secretAccessKey: 'SECRET'
}

const isOffline = () => {
    return process.env.IS_OFFLINE
}

export const document = isOffline()
? new DynamoDB.DocumentClient(options)
: new DynamoDB.DocumentClient()