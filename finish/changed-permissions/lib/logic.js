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
 * @param {composer.sol.acl.voting.vote} vote
 * @transaction 
 */
async function vote(tx) {
    if (!tx.ifVotedAsset.votedOrNot) {
        tx.candidateVoteAsset.totalVote = tx.candidateVoteAsset.totalVote + 1;
        
        let assetRegistry = await getAssetRegistry('composer.sol.acl.voting.candidateVote');
        await assetRegistry.update(tx.candidateVoteAsset);

        assetRegistry = await getAssetRegistry('composer.sol.acl.voting.ifVoted');
        tx.ifVotedAsset.votedOrNot = true;
        await assetRegistry.update(tx.ifVotedAsset);
    } else {
        throw new Error('Vote already submitted!');
    }
}
