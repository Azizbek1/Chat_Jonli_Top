const colors = ['blue', 'green','red','black','orange','white'];


const randomColors = () => {
    return colors[Math.floor(Math.random() * colors.length)]
}

module.exports = randomColors;