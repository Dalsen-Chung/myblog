module.exports = {
  tagsUnique: (tagsFromDB) => { // 去除mongodb中重复的标签,返回去重后的数组
    let newTags = []
    tagsFromDB.forEach((tagsObj) => {
      tagsObj.tags.split(',').forEach((val) => {
        if (newTags.indexOf(val) === -1) {
          newTags.push(val)
        }
      })
    })
    return newTags
  }
}
