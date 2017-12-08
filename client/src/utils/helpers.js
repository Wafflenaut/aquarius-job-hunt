module.exports = {
  trimTrailingS(word) {
    var lastChar = word[word.length-1];

    if (lastChar === "s" || lastChar === "S") {
      return word.slice(0, -1);
    }
    return word;
  },

  daysSincePost(datePostedString) {
    var datePosted = new Date(datePostedString);
    datePosted.setDate(datePosted.getDate()+1);

    var today = new Date();

    var timeDiff = Math.abs(today.getTime() - datePosted.getTime());
    var diffDays = Math.ceil(timeDiff / (1000 * 3600 *  24));

    return diffDays;
  }
}