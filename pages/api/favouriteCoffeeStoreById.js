import { table, findRecordByFilter } from '../../lib/airtable';

const favouriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    try {
      const { id } = req.body;

      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {

          const record = records[0];

          const calculateVoting = parseInt(record.voting) + parseInt(1);

          console.log({ calculateVoting, id: record.id });

          // update a record
          const updateRecord = await table.update([
            {
              id: record.id,
              fields: {
                voting: calculateVoting
              },
            },
          ]);

          if (updateRecord) {
            res.json(updateRecord);
          }
        } else {
          res.json({ message: "Coffee store id doesn't exist", id });
        }
      } else {
        res.status(400);
        res.json({ message: "Id is missing" });
      }
    } catch (err) {
      res.status(500);
      res.json({ message: 'Error upvoting our coffee store', err });
    }
  }
};

export default favouriteCoffeeStoreById;
