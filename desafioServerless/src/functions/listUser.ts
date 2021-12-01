import { APIGatewayProxyHandler } from "aws-lambda";
import { document } from "../util/dynamodbClient";


export const handle:APIGatewayProxyHandler = async (event) => {

    const {id} = event.pathParameters as any


  const response = await document.query({
       TableName: 'users',
       KeyConditionExpression: "user_id = :id",
       ExpressionAttributeValues: {
           ":id" : id
       }
   }).promise()

   
   const userAlreadyExists = response.Items ? response.Items[0] : null

   if(!userAlreadyExists){
       return {
           statusCode: 400,
           body: JSON.stringify({
               error: 'Users not found'
           })
       }
   }

    return {
        statusCode: 200,
        body: JSON.stringify({
            data: response.Items
        })
    }

}