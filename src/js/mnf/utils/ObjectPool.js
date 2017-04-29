// Utility class to manage pool of objects
// @author : David Ronai / @Makio64 / makiopolis.com

class ObjectPool{

	constructor(create, size){
		if( create ) {
      this.init( create, size )
    }
	}

  init( create, size ) {
    this.create = create
		this.size = size
		this.list = []
		for(let i = 0; i<size; i++){
			this.add()
		}
  }

	add() {
		return this.list.push(this.create())
	}

	get() {
		if(this.list.length == 0){
			return this.create()
		}
		else {
			return this.list.pop()
		}
	}

	release( item ) {
		this.list.push(item)
	}
}

module.exports = ObjectPool
