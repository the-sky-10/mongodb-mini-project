const { MongoClient } = require('mongodb');

async function main() {
	const uri =
		'mongodb+srv://<username>:<password>@<your-cluster-url>/myFirstDatabase?retryWrites=true&w=majority';
	const client = new MongoClient(uri);

	try {
		await client.connect();
		// create
		await createMultipleListings(client, [
			{
				description: 'task 1',
				completed: true,
			},
			{
				description: 'task 2',
				completed: false,
			},
			{
				description: 'task 3',
				completed: true,
			},
			{
				description: 'task 4',
				completed: false,
			},
		]);

		// read
		const cursor = client.db('example').collection('Tasks').find();
		const results = await cursor.toArray();
		console.log(results);

		// update
		await client
			.db('example')
			.collection('Tasks')
			.updateMany(
				{ completed: { $exists: false } },
				{ $set: { completed: true } }
			);
		console.log(`document(s) was/were updated.`);

		// delete
		const result = await client
			.db('example')
			.collection('Tasks')
			.deleteOne({ id: '60467bb9a9c23bcef5784565' });
		console.log(`${result.deletedCount} document(s) was/were deleted.`);
	} finally {
		// Close the connection to the MongoDB cluster
		await client.close();
	}
}

main().catch(console.error);

async function createMultipleListings(client, newListings) {
	const result = await client
		.db('example')
		.collection('Tasks')
		.insertMany(newListings);

	console.log(
		`${result.insertedCount} new listing(s) created with the following id(s):`
	);
	console.log(result.insertedIds);
}
