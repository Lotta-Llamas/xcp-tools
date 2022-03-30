## Dispenser Script
This simple node script will loop through an array of wallet IDs, check if that wallet has any available dispensers and if there has been any sales from the previous time the script was ran.

### How it works
1. Add your wallet ID's in the `WALLET_IDS` array in the script.
2. Run `yarn run disp` to either create a file or write data to an existing file.
3. Run `yarn run disp` again to get recent data and reference off data in the `data.json` file.

If you have an wallet that has no dispensers or if all the dispensers are closed, it will indicate that in the console.

### How can this be improved?
This is a work in progress.  As tools continue to be developed, functionality can be abstracted, coverage can be added, and new API's can be stood up.