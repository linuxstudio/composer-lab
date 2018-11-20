/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

/**
 * Voting transaction
 * @param {composer.sol.register.voting.register} register
 * @transaction 
 */
async function register(tx) {
    const participantRegistry  = await getParticipantRegistry('composer.sol.register.voting.voter');
    const assetRegistry  = await getAssetRegistry('composer.sol.register.voting.ifVoted');

    // Create a new voter resource to be added to the ledger
    let voter = getFactory().newResource('composer.sol.register.voting','voter',tx.voterID);
    voter.fullName = tx.fullName;
    
    // See whether the voter can be successfully registered
    await participantRegistry.add(voter);

    // Define the new ifVoted asset corresponding to just registered user...
    let ifVoted = getFactory().newResource('composer.sol.register.voting','ifVoted',tx.voterID);

    await assetRegistry.add(ifVoted);

    // Emit an event for the modified asset.
    let event = getFactory().newEvent('composer.sol.register.voting', 'hasRegistered');
    event.voterID = tx.voterID;
    emit(event);            
}

/**
 * Voting transaction
 * @param {composer.sol.register.voting.vote} vote
 * @transaction 
 */
async function vote(tx) {
    if (!tx.ifVotedAsset.votedOrNot) {
        tx.candidateVoteAsset.totalVote = tx.candidateVoteAsset.totalVote + 1;
        
        let assetRegistry = await getAssetRegistry('composer.sol.register.voting.candidateVote');
        await assetRegistry.update(tx.candidateVoteAsset);

        assetRegistry = await getAssetRegistry('composer.sol.register.voting.ifVoted');
        tx.ifVotedAsset.votedOrNot = true;
        await assetRegistry.update(tx.ifVotedAsset);

        // Emit an event for the modified asset.
        let event = getFactory().newEvent('composer.sol.register.voting', 'hasVoted');
        event.candidateVoteAsset = tx.candidateVoteAsset;
        emit(event);        
    } else {
        throw new Error('Vote already submitted!');
    }
}
