const web3 = require("@solana/web3.js");
const {createMint} = require("@solana/spl-token");
const wallet = require('../solana_client/wallet.json');

async function main() {
    let connection = new web3.Connection(web3.clusterApiUrl("devnet"), "confirmed");
    let keypair = web3.Keypair.fromSecretKey(new Uint8Array(wallet));

    const mint=await createMint(
        connection,
        keypair,
        keypair.publicKey,
        null,
        6
    )
    
    console.log("Mint address: ", mint.toBase58());
}

main();