const web3 = require("@solana/web3.js");
const nacl = require("tweetnacl");
require('dotenv').config();

const apiKey = process.env.QUICKNODE_KEY;

async function main() {
    // key pair generation
    let payer = web3.Keypair.generate();
    console.log("Private key ", payer.secretKey.toString());
    console.log("Public key ", payer.publicKey.toString());

    // Airdrop SOL for paying transactions
    // let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    const rpc_url=`https://polished-smart-slug.solana-devnet.quiknode.pro/${process.env.QUICKNODE_KEY}`;
    let connection = new web3.Connection(rpc_url)

    let airdropSignature = await connection.requestAirdrop(
    payer.publicKey,
    web3.LAMPORTS_PER_SOL,
    );
    
    await connection.confirmTransaction({ signature: airdropSignature });

    let payerBalance= await connection.getBalance(payer.publicKey);
    console.log("Payer balance", payerBalance);
    
    let toAccount = web3.Keypair.generate();
    
    // Create Simple Transaction
    let transaction = new web3.Transaction();
    
    // Add an instruction to execute\
    transaction.add(
    web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000,
    }),
    );
    
    // Send and confirm transaction
    // Note: feePayer is by default the first signer, or payer, if the parameter is not set
    receipt = await web3.sendAndConfirmTransaction(connection, transaction, [payer]);
    console.log("Transaction receipt: ", receipt)
    
    // Alternatively, manually construct the transaction
    let recentBlockhash = await connection.getRecentBlockhash();
    let manualTransaction = new web3.Transaction({
    recentBlockhash: recentBlockhash.blockhash,
    feePayer: payer.publicKey,
    });
    manualTransaction.add(
    web3.SystemProgram.transfer({
        fromPubkey: payer.publicKey,
        toPubkey: toAccount.publicKey,
        lamports: 1000,
    }),
    );
    
    let transactionBuffer = manualTransaction.serializeMessage();
    let signature = nacl.sign.detached(transactionBuffer, payer.secretKey);
    
    manualTransaction.addSignature(payer.publicKey, signature);
    
    let isVerifiedSignature = manualTransaction.verifySignatures();
    console.log(`The signatures were verified: ${isVerifiedSignature}`);
    
    // The signatures were verified: true
    
    let rawTransaction = manualTransaction.serialize();
    
    await web3.sendAndConfirmRawTransaction(connection, rawTransaction);
}

main();