module.exports =  class SequenceHelper {
	constructor (options) {
		this.db = options.db;
		this.sequence = options.sequence;
		// this.table = options.table;
		this.field = options.field || "ID";
	}

	getNextNumber() {
		return new Promise((resolve, reject) => {
			let nextNumber = 0;
			this.db.run(`SELECT "${this.sequence}".NEXTVAL FROM DUMMY`)
						.then(result => {
							nextNumber = result[0][`${this.sequence}.NEXTVAL`];
							resolve(nextNumber);
						})
						.catch(error => {
							reject(error);
						});
		});
	}
};