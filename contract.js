'use strict';
const { Contract } = require('fabric-contract-api');
const { checkAssetExist, getAllAssets, editAsset, getAssetByProp, checkEnum, createAssetObj, toJSON, getAllAssetsByPartialKey } = require('./utils');

class voting_contract extends Contract {

    async test(ctx) {
        console.info('============= Test Started Contract ===========');
    }
    async initLedger(ctx) {
        console.info('============= END : Initialize Ledger ===========');
    }


    async createVoter(ctx, userInput) {
        let voterSchema = {
            name: 'voterSchema',
            properties: [{
                name: 'firstName',
                type: 'string',
                required: 'true'
            }, {


                name: 'lastName',
                type: 'string',
                required: 'true'


            }, {


                name: 'DistrictName',
                type: 'string',
                required: 'true'


            }, {


                name: 'electionID',
                type: 'asset',
                required: 'true'


            },{


                name: 'VoterId',
                type: 'string',
                default:uuid.v4


            }


            ]
        }

        await createAssetObj(ctx, JSON.stringify(voterSchema), userInput);
        voter = toJSON(userInput);

        

        let newkey = voter.VoterId + ctx.stub.getTxTimestamp().seconds.low.toString();

        
        for(let i=0;i<election.voters.length;i++)
        {

            if (election.voters[i] === voter.VoterId)
            {

                throw new Error('This voter is already signed up for this election');


            }


        }

        election.voter.push(voter.VoterId);

        await ctx.stub.putState(newkey, Buffer.from(JSON.stringify(voter)));

        return JSON.stringify({
            Key: newkey,
            Record: userInput
        });

    }




    async createElection(ctx, txObj) {


        let electionSchema = {
            name: 'electionSchema',
            properties: [{

                name: 'electionId',
                type: 'String',
                default:uuid.v4
            }, {

                name: 'electionName',
                type: 'String',
                required: 'true'




            }, {

                name: 'electionCountry',
                type: 'String',
                required: 'true'




            }, {
                name: 'electionYear',
                type: 'Number',
                required: 'true'


            }, {
                name: 'electionStartDate',
                type: 'Date',
                required: 'true'
            }, {
                name: 'electionEndDate',
                type: 'Date',
                required: 'true'
            }
            ]
        }

        await createAssetObj(ctx, JSON.stringify(electionSchema), txObj);
        let election = toJSON(txObj);

        let newkey = txObj.electionId + ctx.stub.getTxTimestamp().seconds.low.toString();

        election.candidates = [];
        election.voters=[];


        await ctx.stub.putState(newkey, Buffer.from(JSON.stringify(election)));
        return JSON.stringify({
            Key: newkey,
            Record: txObj
        });







    }





    async createCandidate(ctx, txObj) {


        let candidateSchema = {

            name: 'candidateSchema',
            properties: [{

                name: 'candidateId',
                type: 'String',
                default:uuid.v4

            }, {

                name: 'candidateName',
                type: 'String',
                required: 'true'


            }, {

                name: 'candidateParty',
                type: 'String',
                required: 'true'


            }, {

                name: 'electionId',
                type: 'asset',
                required: 'true'



            }]







        }

        await createAssetObj(ctx, JSON.stringify(candidateSchema), txObj);
        let candidate = toJSON(txObj);

        let newkey = txObj.candidateId + ctx.stub.getTxTimestamp().seconds.low.toString();




        candidate.score = 0;

        
        candidateObj = {id: candidate.id , score:candidate.score}

        election.candidate.push(txObj.candidateObj);

        await ctx.stub.putState(newkey, Buffer.from(JSON.stringify(candidate)));



        return JSON.stringify({
            Key: newkey,
            Record: txObj
        });


    }






    async vote(ctx, txObj) {


        let voteSchema = {

            name: 'candidateSchema',
            properties: [
                {
                    name: 'VoteId',
                    type: 'String',
                    default:uuid.v4

                }, {
                    name: 'VoterId',
                    type: 'String',
                    required: 'true'

                }, {
                    name: 'candidateId',
                    type: 'String',
                    required: 'true'
                }, {
                    name: 'electionId',
                    type: 'String',
                    required: 'true'



                }]
        }


        await createAssetObj(ctx, JSON.stringify(voteSchema), txObj);
        vote = toJSON(txObj);


        let election = await checkAssetExist(ctx, vote.electionId, 'ELECTION');

        let flag = false
        for (let i = 0; i < election.candidates.length; i++) {

            if (election.candidates[i] === vote.candidateId) {

                flag = true;
                break;
            }


        }

        if (!flag) {
            throw new Error('Candidate not found');

        }

        election.candidates[i].score++;


        let newkey = vote.voteId + ctx.stub.getTxTimestamp().seconds.low.toString();

        await ctx.stub.putState(newkey, Buffer.from(JSON.stringify(vote)));
        return JSON.stringify({
            Key: newkey,
            Record: txObj
        });




    }






    async queryAllAsset(ctx, asset) {
        return JSON.stringify(await getAllAssets(ctx, asset));
    }

    async queryAsset(ctx, key, assetName) {
        if (!assetName || assetName === 0) {
            assetName = 'asset';
        }
    }

    async deleteAsset(ctx, key, assetName) {
        if (!assetName) {
            assetName = 'asset';
        }
        await checkAssetExist(ctx, key, assetName);
        await ctx.stub.deleteState(key);
        return JSON.stringify(key);
    }


    async queryAssetByProp(ctx, properties) {
        return JSON.stringify(await getAssetByProp(ctx, properties));
    }

    async updateAsset(ctx, key, newProparties) {
        let asset = await editAsset(ctx, key, newProparties);
        return JSON.stringify({ key: key, asset });
    }




}


module.exports = voting_contract;

