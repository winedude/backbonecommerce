var Orders = Backbone.View.extend({
	id: 'orders',
	template: _.template(document.getElementById('orders-template').innerHTML),
	initialize: function() {
		this.render();
		this.getOrders((orders) => {
			new ListView({
				el: this.el.querySelector('#orders'),
				collection: orders,
			});
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template();
		this.el.querySelector('#toorders').setAttribute('active', true);
		return this;
	},
	events: {
	},
	getOrders: function(callback) {
		Socket.emit('d.orders.get');
		Socket.once('d.orders.get', (data) => {
			var collection = new Backbone.Collection;
			for (let entry of data) {
				var model = new OrderModel(entry);
				collection.add(model);
			}
			return callback(collection);
		});
	},
});

var Order = Backbone.View.extend({
	id: 'order',
	template: _.template(document.getElementById('order-template').innerHTML),
	initialize: function() {
		this.getOrder((order) => {
			this.model = order;
			this.render();
		});
		return this;
	},
	render: function() {
		this.el.innerHTML = '';
		this.el.innerHTML = this.template(this.model.attributes);
		this.el.querySelector('#toorders').setAttribute('active', true);
		Backbone.history.navigate('dashboard/order', false);
		return this;
	},
	events: {
		'click button#check': 'check',
	},
	getOrder: function(callback) {
		Socket.emit('d.order.get', this.model.get('_id'));
		Socket.once('d.order.get', (data) => {
			var order = new OrderModel(data);
			return callback(order);
		});
	},
	check: function(e) {
		if (e.target.getAttribute('inactive') == 'true') return;
    e.target.setAttribute('inactive', true);
		Socket.emit('d.order.check', this.model.get('_id'));
	}
});
