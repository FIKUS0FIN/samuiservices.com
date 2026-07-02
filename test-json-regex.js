const resultText = `Here is the data:
{
  "test": 123
}
Hope this helps!`;
const match = resultText.match(/\{[\s\S]*\}/);
console.log(match ? match[0] : "no match");
