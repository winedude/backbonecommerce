var Item = Backbone.View.extend({
	id: 'item',
	template: _.template(document.getElementById('item-template').innerHTML),
	initialize: function(options) {
		_.extend(this, _.pick(options, '_id'));
		this.getItem((item) => {
			this.listenTo(User, 'change:shoppingcart', this.count);
			this.model = item;
			this.render();
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
		return this;
	},
	events: {
		'click #navi': 'navi',
		'click button': 'tocart',
		'mousemove .image': 'follow',
		'mouseout .image': 'reset'
	},
	navi: function() {
		var el = this.el.querySelector('.navi');
		if (el.style.display == 'grid') return el.style.display = 'none';
		else return el.style.display = 'grid';
	},
	count: function() {
		var value = this.el.querySelector('#count').innerText;
		return this.el.querySelector('#count').innerText = Number(value)+1;
	},
	getItem: function(callback) {
		Socket.emit('item.get', this._id);
		Socket.once('item.get', (data) => {
			var model = new ItemModel(data);
			return callback(model);
		});
	},
	tocart: function(e) {
    if (e.target.getAttribute('inactive') == 'true') return;
    e.target.setAttribute('inactive', true);
    Socket.emit('shoppingcart.add', this.model.get('_id'));
    User.set('shoppingcart', User.get('shoppingcart')+1);
  },
	follow: function(e) {
		var image = e.target;
		var x = e.clientX-image.width;
		var y = e.clientY-image.height;
		if (x > image.width/4 || x < -image.width/4) return;
		if (y > image.height/4 || y < -image.height/4) return;
		image.style.transform = 'translateX('+x+'px)';
		image.style.transform += 'translateY('+y+'px)';
	},
	reset: function(e) {
		e.target.style.transform = '';
	}
});
