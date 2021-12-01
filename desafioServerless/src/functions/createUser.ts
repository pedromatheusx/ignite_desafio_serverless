import { document } from "../util/dynamodbClient";
import { APIGatewayProxyHandler } from "aws-lambda";

import {v4 as uuidV4, validate} from 'uuid'
interface iCreateUser {
    title: string,
    deadline: Date
}

export const handle: APIGatewayProxyHandler = async(event) => {
    const {id: user_id} = event.pathParameters as any
    const {title, deadline} = JSON.parse(event.body as string) as iCreateUser

    if(!validate(user_id)){
        return {
            statusCode: 400,
            body: JSON.stringify({
                error: 'ID invalid'
            })
        }
    }


    const response = await document.query({
        TableName: "users",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
            ":user_id": user_id
        }
    }).promise()

    const userAlreadyExists = response.Items ? response.Items[0] : null
    
    if(!userAlreadyExists){
        await document.put({
            TableName: "users",
            Item: {
            id:  uuidV4(),
            user_id,
            done: false,
            deadline
            }
        }).promise()
    }
   
    return {
        statusCode: 200,
        body: JSON.stringify({
            message: "Created with sucess"
        })
    }
}