import { makeExecutableSchema } from 'graphql-tools';


import resolvers from './resolvers';

const schema = `
type Author {
  id: Int! # the ! means that every author object _must_ have an id
  firstName: String
  lastName: String
  posts: [Post] # the list of Posts by this author
}

type Post {
  id: Int!
  title: String
  author: Author
  votes: Int
}

scalar CustomGraphQLDateType

type ArgumentValueType {
  index: Int
  dataType: String
  arrayType: String
  value: TypedArgumentValue
}

enum BrowseDirectionEnum {
  Invalid
  Forward
  Inverse
  Both
}

union TypedArgumentValue = BooleanArgumentValue | IntArgumentValue | Int64ArgumentValue | FloatArgumentValue | StringArgumentValue

type BooleanArgumentValue {
  value: Boolean
}

type FloatArgumentValue {
  value: Float
}

type Int64ArgumentValue {
  value: [Int]
}

type IntArgumentValue {
  value: Int
}

type StringArgumentValue {
  value: String
}



enum NodeClassEnum {

  # 0
  # No classes are selected.
  Unspecified 

  # 1
  # The node is an object.
  Object
  
  # 2
  # The node is a variable.
  Variable 

  # 4
  # The node is a method.
  Method 

  # 8
  # The node is an object type.
  ObjectType
  
  # 16
  # The node is an variable type.
  VariableType 

  # 32
  # The node is a reference type.
  ReferenceType 

  # 64
  # The node is a data type.
  DataType

  # 128
  # The node is a view.
  View
}


# http://node-opcua.github.io/api_doc/classes/LocalizedText.html
type LocalizedText {
  text: String
  locale: String
}
# http://node-opcua.github.io/api_doc/classes/ExpandedNodeId.html
type ExpandedNodeId {
  identifierType: String
  value: String
  namespace: Int
  namespaceUri: String
  serverIndex: Int
  uaNode: UaNode
}


# http://node-opcua.github.io/api_doc/classes/QualifiedName.html
type QualifiedName {
    namespaceIndex: Int
    name: String
  }

# http://node-opcua.github.io/api_doc/classes/StatusCode.html
type StatusCode {
  value: Float
  description: String
  name: String
}


interface IValue {
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}

type DataValue implements IValue {
  value: TestUnion
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}

type BrowseName implements IValue {
  value: QualifiedName
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}
type DisplayName implements IValue {
  value: LocalizedText
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}
type IntValue implements IValue {
  value: Int
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}
type BooleanValue implements IValue {
  value: Boolean
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}
type FloatValue implements IValue {
  value: Float
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}

type ExpandedNode implements IValue {
  value: ExpandedNodeId
  statusCode: StatusCode
  sourceTimestamp: CustomGraphQLDateType
  sourcePicoseconds: Int
  serverTimestamp: CustomGraphQLDateType
  serverPicoseconds: Int
}

union TestUnion =  UaNull | UaLong | UaInt | UaFloat | UaIntArray | UaString | UaStringArray


# Data type and array type for data values
interface UaDataValue {
  dataType: String
  arrayType : String
  statusCode: StatusCode
}

type UaNull implements UaDataValue {
  dataType: String
  arrayType: String
  value: String
  statusCode: StatusCode
}
type UaLong implements UaDataValue {
  dataType: String
  arrayType: String
  value: Int
  statusCode: StatusCode
}
type UaInt implements UaDataValue {
  dataType: String
  arrayType: String
  value: Int
  statusCode: StatusCode
}
type UaIntArray implements UaDataValue {
  dataType: String
  arrayType: String
  value: [Int]
  statusCode: StatusCode
}

type UaFloat implements UaDataValue {
  dataType: String
  arrayType: String
  value: Float
  statusCode: StatusCode
}
type UaString implements UaDataValue {
  dataType: String
  arrayType: String
  value: String
  statusCode: StatusCode
}
type UaStringArray implements UaDataValue {
  dataType: String
  arrayType: String
  value: [String]
  statusCode: StatusCode
}



enum ResultMaskEnum {
  ReferenceType
  IsForward
  NodeClass
  BrowseName
  DisplayName
  TypeDefinition
}
type References {
  statusCode: StatusCode
  references: [UaReference]
}
type UaReference {
  id: ID!
  browseName: QualifiedName
  displayName: LocalizedText
  isForward: Boolean
  nodeClass: String
  nodeId: ExpandedNodeId
  referenceTypeId: ExpandedNodeId
  typeDefinition: ExpandedNodeId
}

type UaNode {
  id: String!
  nodeClass: NodeClassEnum
  browseName: BrowseName
  displayName: DisplayName
  writeMask: IntValue
  userWriteMask: IntValue
  isAbstract: BooleanValue
  symmetric: BooleanValue
  inverseName: DisplayName
  containsNoLoops: BooleanValue
  eventNotifier: IntValue
  nodeId: ExpandedNode
  description: DisplayName
  dataValue: DataValue
  dataType: ExpandedNode
  valueRank: IntValue
  arrayDimensions: [Int] # sort later
  accessLevel: IntValue
  userAccessLevel: IntValue
  minimumSamplingInterval: FloatValue
  historizing: BooleanValue
  executable: BooleanValue
  userExecutable: BooleanValue
  outputArguments: [ArgumentValueType]# sort later
  #browsePath(paths: [String] = [], types: [String] = [], subTypes: [Boolean] = [], isInverses: [Boolean] = []): UANode
  references(
    referenceTypeId: String, 
    browseDirection: BrowseDirectionEnum, 
    nodeClasses: [NodeClassEnum], 
    results: [ResultMaskEnum], 
    includeSubtypes: Boolean, 
    last: Int, 
    before: String, 
    first: Int, 
    after: String
  ): References
  self: UaNode

}



# the schema allows the following query:
type Query {
  uaNode(id: String!): UaNode
  post(id: Int): Post,
  posts: [Post],
  authors: [Author]
}


# this schema allows the following mutation:
type Mutation {
  upvotePost (
    postId: Int!
  ): Post
}

type Subscription {
  postUpvoted(id: Int): Post
  value(id: String): UaNode
}

`;

export default makeExecutableSchema({
  typeDefs: [schema],
  resolvers,
});