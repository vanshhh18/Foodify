function CreateDonation() {
  return (
    <div>
      <h1>Create Donation</h1>

      <form>
        <div>
          <label>Category</label>
          <select>
            <option value="">Select category</option>
            <option value="food">Food</option>
            <option value="clothes">Clothes</option>
            <option value="books">Books</option>
          </select>
        </div>

        <div>
          <label>Title</label>
          <input type="text" placeholder="Enter donation title" />
        </div>

        <div>
          <label>Description</label>
          <textarea placeholder="Describe your donation" />
        </div>

        <div>
          <label>Quantity</label>
          <input type="text" placeholder="Example: 20 packets" />
        </div>

        <div>
          <label>Pickup Address</label>
          <input type="text" placeholder="Enter pickup address" />
        </div>

        <button type="submit">
          Create Donation
        </button>
      </form>
    </div>
  );
}

export default CreateDonation;