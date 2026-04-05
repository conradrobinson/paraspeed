# Parser

This folder handles the mathsJSON to conrad's WGSL AST conversion

It also handles any necessary alterations
- E.g. y=x -> y-x
- Takes anything on the right of an equals and chucks it onto the left

The parser classifies each input string as a variable, a derived variable, , or an equation
It lists the variables so they can be used in a dependency graph and cycle detection for ordering
It lists the functions so they can be checked after the fact -> ensuring any lines of code
    Without a legal variable or function are not displayed 

I want it to have a nice interface as this was a particular trouble with previous iterations

You should pass in a mathjson object only
You should receive as output:
- The final AST
- The type of string
- The functions used
- The variables used

This interface should be modular as scope increases

# Example MathJSON
["Add", ["Power", "x", 2], ["Multiply", 2, "x"], 1]

