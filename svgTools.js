//Function to split svg String into seperate lines
function splitSvg(svgStr){
	var linesArray = new Array();
	var svgCode = svgStr;

	linesArray = svgCode.split("<");
	return linesArray;
}
//rebuilds linesArray from sections
function rebuildLinesArray(sections){
	var temp = new Array();
	var linesArray = new Array();
	temp = sections;
	linesArray = linesArray.concat(sections[0]);
	linesArray = linesArray.concat(sections[1]);
	linesArray = linesArray.concat(sections[2]);

	return linesArray;
}

//Function to Rebuilt Svg from Array
function rebuildSvg(linesArray){

	var lines = linesArray;
	var svgStr = "";
	for(var i = 0; i<lines.length; i++){
		svgStr += "<";
		svgStr += lines[i];
	}

	return svgStr;
}
//Function to change guides to boxes
function guidesBackground(){
	var svgCode = localStorage.getItem("svg");
	var sections = separateSVG(svgCode);
	var newStart = new Array();
	var spaceArray = new Array();
	var temp;
	var colNo = -1;
	var lines = sections[1];
	var line = sections[0];
	var start;
	var end;
	var size;
	var xStartLine = 1000;
	var xSpacing;
	var xSpacing2;
	var tempStr;
	newStart.push(line[0]);
	line.shift();
	//gets spacing of columns
	for (var i = 0; i < lines.length; i++) {
		if(lines[i].includes("line")){
			start = lines[i].indexOf("x1=")+4;
			end = lines[i].indexOf("y1=")-2;
			size = end - start;
			temp = parseInt(lines[i].substr(start, size));
			if(temp < xStartLine){
				xStartLine = temp;
			}
		}
	}
	//Gets spacing of first column.
	start = line[0].indexOf("x1=")+4;	
	end = line[0].indexOf("y1=")-2;
	size = end - start;
	tempStr = parseInt(line[0].substr(start, size));
	xSpacing = tempStr - xStartLine;
	spaceArray.push(xSpacing);
	//loop to find spacing of each column.
	for(var i = 1; i < line.length; i++){
		start = line[i].indexOf("x1=")+4;	
		end = line[i].indexOf("y1=")-2;
		size = end - start;
		tempStr = parseInt(line[i].substr(start, size));
		xSpacing2 = tempStr - xStartLine;
		spaceArray.push(xSpacing2-xSpacing);
		xSpacing = xSpacing2;
		colNo++;
	}
	spaceArray.shift();
	var mod;//value to hold modulus
	var height = getHeight(newStart[0]);//gets height of diagram
	//Creates a rectangle guide for every other column
	for (var i = 0; i < spaceArray.length; i++) {
		mod = i%2;
		if(mod==0){
			temp = 'rect x="'+xStartLine+'" y=0 width="'+spaceArray[i]+'" '+height+' fill="#EEE5DE" stroke-width="0"/>'+"\n";
			newStart.push(temp);	
		}
		xStartLine = xStartLine+spaceArray[i];	
	}
	sections[0] = newStart;//Changes start of Svg to background guides.
	lines = rebuildLinesArray(sections);//rebuilds lines array
	svgCode = rebuildSvg(lines);//rebuilds Svg string

	return svgCode;

}
//Function to remove guides
function guidesNone(){
	var svgCode = localStorage.getItem("svg");
	var sections = separateSVG(svgCode);
	var lines = sections[0];
	sections[0] = lines[0];
	lines = rebuildLinesArray(sections);
	svgCode = rebuildSvg(lines);

	return svgCode;
}
//Sort D with minimum line spaces
function sortForce(arr){
	var svgCode = localStorage.getItem("svg");
	var n1 = num1-1;
	var n2 = num2-1;
	var labels = new Array();
	var rowOverlaps = new Array();
	var swapNo = new Array();
	var colOverLaps = new Array();
	var strokeArray = new Array();
	var xPosArray = new Array();
	var tempArr = new Array();
	var tempRow = new Array();
	var trueRow = new Array();
	var falseRow = new Array();
	var tempGap;
	var tempCols;
	var gaps;
	var names = arr;
	//variables for y axis
	var yStartLbl;
	var yStartLine;
	var ySpacing;
	//variables for x axis
	var spaceArray = new Array();
	var xStartEnd;
	var xStartLine;
	var xSpacing;
	//temp values
	var start;
	var end;
	var size;
	var tempStr;
	var colNo = -1;
	var sections = separateSVG(svgCode);
	//GET Y AXIS VALUES
	var lines = sections[1];
	//gets label y start value
	yStartLbl = getYStart(lines);
	//gets line y start value
	yStartLine = getYStartLine(lines);
	//gets y axis spacing
	swapNo = getLineNo(lines);
	ySpacing = getYAxisSpace(lines, yStartLbl, swapNo);
	//GET X AXIS VALUES
	lines = sections[0];
	//gets starting x value
	xStartLine = getXLineStart(lines);
	//gets x End value
	xEnd = getXLineEnd(lines);
	//gets spacing of columns
	var xSpacing2;
	start = lines[0].indexOf("x1=")+4;	
	end = lines[0].indexOf("y1=")-2;
	size = end - start;
	tempStr = parseInt(lines[0].substr(start, size));
	xSpacing = tempStr - xStartLine;
	//loop to find spacing of each column.
	for(var i = 1; i < lines.length; i++){
		start = lines[i].indexOf("x1=")+4;	
		end = lines[i].indexOf("y1=")-2;
		size = end - start;
		tempStr = parseInt(lines[i].substr(start, size));
		xSpacing2 = tempStr - xStartLine;
		spaceArray.push(xSpacing2-xSpacing);
		xSpacing = xSpacing2;
		colNo++;
	}
	//removes first index of array (blank entry)
	spaceArray.shift();
	//gets array of labels
	labels = getLabels(sections[1], swapNo);
	strokeArray = getStrokes(sections[1], swapNo);
	xPosArray = getXPos(sections[1], swapNo);
	//gets populated columns for each row
	lines = sections[1];
	lines = getLines(lines);
	lines.shift();
	for (var i = 0; i < lines.length; i++) {
		rowOverlaps.push(rowPop(lines[i], colNo, spaceArray, xStartLine));
	}
	//transpose rows to columns
	colOverLaps = transpose(rowOverlaps);
	//Populates tempArr to pass data needed to sortDForce function
	tempArr = [];
	tempArr.push(labels);
	tempArr.push(colOverLaps);
	tempArr.push(spaceArray);
	tempArr.push(names);
	holding = sortDForce(tempArr);
	//returns columns array and spaces
	colOverLaps = holding[1];
	spaceArray = holding[2];
	//transpose back to rows
	rowOverlaps = transpose(colOverLaps);
	//redraws with new diagram info.
	redrawOverlaps(rowOverlaps, spaceArray, sections, labels, xStartLine, spaceArray, yStartLbl, yStartLine, ySpacing, xPosArray, strokeArray, colNo);
}

//sortDForce function
function sortDForce(arr){
	var holding = arr;
	var names = holding[0];
	var diagram = holding[1];
	var spaceArray = holding[2];
	var prio = holding[3];
	var nPresent = new Array();
	var nAbsent = new Array();
	var trueCols = new Array();
	var falseCols = new Array();
	var ret = new Array();
	var temp = new Array();
	holding = [];
	//No priority 
	if(prio.length == 0){
		diagram = transpose(diagram);
		holding = sortD(diagram, spaceArray);
		diagram = holding[0];
		spaceArray = holding[1];

		diagram = transpose(diagram);
		ret.push(names);
		ret.push(diagram);
		ret.push(spaceArray);
		ret.push(prio);

		return ret;
	  //1 Priority label	
	  //This will error check absent and present columns to avoid transpose errors.	
	} else if(prio.length == 1){
		holding = findPresent(diagram, spaceArray, prio[0]);
		nPresent = holding[0];
		nAbsent = holding[1];
		trueCols = holding[2];
		falseCols = holding[3];
		holding = [];
		//if either absent or present sections of the diagram are less than or equal to
		//1, no sorting will be atempted of this section.
		if(nAbsent.length > 1 && nPresent > 1){
			//transposes to rows for sorting
			nPresent = transpose(nPresent);
			nAbsent = transpose(nAbsent);
			//sorts the present section of the diagram.
			holding = sortD(nPresent, trueCols);
			nPresent = holding[0];
			trueCols = holding[1];
			holding = [];
			// sorts the absent section of the diagram
			holding = sortD(nAbsent, falseCols);
			nAbsent = holding[0];
			falseCols = holding[1];
			holding = [];
			//transposes to columns for addition
			nPresent = transpose(nPresent);
			nAbsent = transpose(nAbsent);
		} else if(nAbsent.length <= 1 && nPresent > 1){
			//transposes to rows for sorting
			nPresent = transpose(nPresent);
			//sorts the present section of the diagram
			holding = sortD(nPresent, trueCols);
			nPresent = holding[0];
			trueCols = holding[1];
			holding = [];
			//transposes to columns for addition
			nPresent = transpose(nPresent);
		} else if(nAbsent.length > 1 && nPresent <= 1){
			//transposes to rows for sorting
			nAbsent = transpose(nAbsent);
			//sorts the absent section of the diagram
			holding = sortD(nAbsent, falseCols);
			nAbsent = holding[0];
			falseCols = holding[1];
			holding = [];
			//transposes to columns for addition
			nAbsent = transpose(nAbsent);
		}
		//adds the 2 sections of the diagram together and returns the new diagram.
		holding = addDPlus(nPresent, nAbsent, trueCols, falseCols);
		diagram = holding[0];
		spaceArray = holding[1];
		ret.push(names);
		ret.push(diagram);
		ret.push(spaceArray);
		ret.push(prio);

		return ret;
		//More than 1 priority label. This section will remove a priority label from the list and 
		//recursively call itself.
	} else {
		var temp = new Array();//holding array 
		//checks to make sure the number of columns is greater than 1
		if(diagram.length > 1){
			//checks for absent and present sections of diagram.
			holding = findPresent(diagram, spaceArray, prio[0]);
			nPresent = holding[0];
			nAbsent = holding[1];
			trueCols = holding[2];
			falseCols = holding[3];
			holding = [];
			//sets the tempPrio as 2nd label (used to rebuild diagram.)
			var tempPrio = prio[1];
			prio.shift();//removes the first index of the array for passing to next function
			//Recursively call sortDForce to check for second prio
			temp.push(names);
			temp.push(nPresent);
			temp.push(trueCols);
			temp.push(prio);
			//sets rebuild present
			if (nPresent>1) {
				holding = sortDForce(temp);
				nPresent = holding[1];
				trueCols = holding[2];
			}
			temp = [];
			temp.push(names);
			temp.push(nAbsent);
			temp.push(falseCols);
			temp.push(prio);
			//sets rebuilt absent
			if(nAbsent>1){
				holding = sortDForce(temp);
				nAbsent = holding[1];
				falseCols = holding[2];
			}
			//Adds 2 diagrams based on the 2nd priority label.
			temp = addDPlusL(nPresent, nAbsent, trueCols, falseCols, tempPrio);
			//sets new diagram
			diagram = temp[0];
			spaceArray = temp[1];
		}
		ret.push(names);
		ret.push(diagram);
		ret.push(spaceArray);
		ret.push(prio);
		//returns new array.
		return ret;
	}
}
//Function to add 2 diagrams together including d1+d2, d2+d1 and reversals
function addDPlusL(dia1, dia2, space1, space2, num){
	var present = dia1;
	var absent = dia2;
	var preSpace = space1;
	var abSpace = space2;
	var num = num;
	var ret = new Array();
	var rev = new Array();
	var spaceRev = new Array();
	var tempRet = new Array();
	var temp = new Array();
	var temp2 = new Array();
	var gaps = 100000; 
	var tempGaps;
	var test;
	var totalGaps = 100000;
	
	//Addition of A1s to A2s
	tempRet = addD(present, absent, preSpace, abSpace);
	temp = tempRet[0];
	temp2 = transpose(temp);
	tempGaps = checkGapsL(temp2,num);
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;	
	} 
		
	//Addition of A1s to A2r
	rev = absent.reverse();
	spaceRev = abSpace.reverse();
	tempRet = addD(present, rev, preSpace, spaceRev);
	temp = tempRet[0];
	temp2 = transpose(temp);
	tempGaps = checkGapsL(temp2,num);
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	
	//Addition or A2s to A1s
	tempRet = addD(absent, present, abSpace, preSpace);
	temp = tempRet[0];
	temp2 = transpose(temp);
	tempGaps = checkGapsL(temp2,num);
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	
	//Addition or A2r to A1s
	rev = absent.reverse();
	spaceRev = abSpace.reverse();
	tempRet = addD(rev, present, spaceRev, preSpace);
	temp = tempRet[0];
	temp2 = transpose(temp);
	tempGaps = checkGapsL(temp2,num);
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	
	return ret;
}
//Function to add 2 diagrams together including d1+d2, d2+d1 and reversals
function addDPlus(dia1, dia2, space1, space2){
	var present = dia1;
	var absent = dia2;
	var preSpace = space1;
	var abSpace = space2;
	var ret = new Array();
	var rev = new Array();
	var rev2 = new Array();
	var spaceRev = new Array();
	var spaceRev2 = new Array();
	var tempRet = new Array();
	var temp = new Array();
	var gaps = 100000; 
	var tempGaps;

	//Addition of A1s to A2s
	tempRet = addD(present, absent, preSpace, abSpace);
	temp = tempRet[0];
	tempGaps = checkGaps(transpose(temp));
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	} 	
	//Addition of A1s to A2r
	rev = absent.reverse();
	spaceRev = abSpace.reverse();
	tempRet = addD(present, rev, preSpace, spaceRev);
	temp = tempRet[0];
	tempGaps = checkGaps(transpose(temp));
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	//Addition or A2s to A1s
	tempRet = addD(absent, present, abSpace, preSpace);
	temp = tempRet[0];
	tempGaps = checkGaps(transpose(temp));
	
	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	//Addition or A2r to A1s
	rev = absent.reverse();
	spaceRev = abSpace.reverse();
	tempRet = addD(rev, present, spaceRev, preSpace);
	temp = tempRet[0];
	tempGaps = checkGaps(transpose(temp));

	if(tempGaps < gaps){
		ret = tempRet;
		gaps = tempGaps;
	}	
	
				
	return ret;
}
//Function to add 2 diagrams together
function addD(dia1, dia2, space1, space2){
	var present = dia1;
	var absent = dia2;
	var preSpace = space1;
	var abSpace = space2;
	var ret = new Array();
	
	present = present.concat(absent);
	preSpace = preSpace.concat(abSpace);

	ret.push(present);
	ret.push(preSpace);
	
	return ret;
}
//Function to return present and absent arrays (Fixed to allow diagrams of 1 length to pass through)
function findPresent(colOverLaps, spaceArray, num){
	var colOverLaps = colOverLaps;
	var spaceArray = spaceArray;
	var trueSpace = new Array();
	var falseSpace = new Array();
	var trueRow = [];
	var falseRow = [];
	var spaceArray = spaceArray;
	var ret = new Array();
	var trueCols = [];
	var falseCols = [];
	var n1 = num;
	//Checks diagrams of more than 1 length
	if (colOverLaps.length>1) {
		var rowOverlaps = transpose(colOverLaps);
		for (var i = 0; i < rowOverlaps[n1].length; i++) {
			if(rowOverlaps[n1][i] == true){
				trueRow.push(i);

			} else {
				falseRow.push(i);
			}
		}
		for (var i = 0; i <trueRow.length; i++) {
			trueCols.push(colOverLaps[trueRow[i]]);
			trueSpace.push(spaceArray[trueRow[i]]);		
		}
		for (var i = 0; i < falseRow.length; i++) {
			falseCols.push(colOverLaps[falseRow[i]]);
			falseSpace.push(spaceArray[falseRow[i]]);	
		}
		//Diagrams of 1 length with label present.
	} else if(colOverLaps.length<=1 && colOverLaps[0][n1]==true){
		trueCols.push(colOverLaps);
		trueSpace.push(spaceArray);
		//Diagrams of 1 length with label absent.
	} else if (colOverLaps.length<=1 && colOverLaps[0][n1]==false) {
		falseCols.push(colOverLaps);
		falseSpace.push(spaceArray);
	}
	ret.push(trueCols);
	ret.push(falseCols);
	ret.push(trueSpace);
	ret.push(falseSpace);

	return ret;
}
//Function to sort all available labels(used in absense of priority label).
function sortD(rowsArr, spaceArr){

	var rowOverlaps = rowsArr;
	var gaps;
	var tempCols = new Array();
	var tempRow = new Array();
	var tempArr = new Array();
	var ret = new Array();
	var spaceArray = spaceArr;
	var tempGap;

	gaps = checkGaps(rowOverlaps);

	tempCols = transpose(rowOverlaps);
	var swaps = 1000;
	while(swaps>0){
		for (var i = 0; i < tempCols.length; i++) {
			for (var j = 0; j < tempCols.length; j++) {
				tempArr = tempCols[i];
				tempCols[i] = tempCols[j];
				tempCols[j] = tempArr;
				//swaps spacing for columns
				tempArr = spaceArray[i];
				spaceArray[i] = spaceArray[j];
				spaceArray[j] = tempArr;

				tempRow = transpose(tempCols);
				tempGap = checkGaps(tempRow);
				if(tempGap <= gaps){
					rowOverlaps = tempRow;
					gaps = tempGap;
				} else {
					//tempCols = transpose(tempRow);
					tempArr = tempCols[i];
					tempCols[i] = tempCols[j];
					tempCols[j] = tempArr;
					//swaps spacing for columns
					tempArr = spaceArray[i];
					spaceArray[i] = spaceArray[j];
					spaceArray[j] = tempArr;
				}
			}	
		}
		swaps--;
	}

	ret.push(rowOverlaps);
	ret.push(spaceArray);

	return ret;
}
//reorder with minimum line spaces
function orderGaps(){
	var svgCode = localStorage.getItem("svg");
	var labels = new Array();
	var rowOverlaps = new Array();
	var swapNo = new Array();
	var colOverLaps = new Array();
	var strokeArray = new Array();
	var xPosArray = new Array();
	var tempArr = new Array();
	var tempRow = new Array();
	var tempGap;
	var tempCols;
	var gaps;
	//variables for y axis
	var yStartLbl;
	var yStartLine;
	var ySpacing;
	//variables for x axis
	var spaceArray = new Array();
	var xStartEnd;
	var xStartLine;
	var xSpacing;
	//temp values
	var start;
	var end;
	var size;
	var tempStr;
	var colNo = -1;
	var sections = separateSVG(svgCode);
	//GET Y AXIS VALUES
	var lines = sections[1];
	//gets label y start value
	yStartLbl = getYStart(lines);
	//gets line y start value
	yStartLine = getYStartLine(lines);
	//gets y axis spacing
	swapNo = getLineNo(lines);
	ySpacing = getYAxisSpace(lines, yStartLbl, swapNo);
	//GET X AXIS VALUES
	lines = sections[0];
	//gets starting x value
	xStartLine = getXLineStart(lines);
	//gets x End value
	xEnd = getXLineEnd(lines);
	//gets spacing of columns
	var xSpacing2;
	start = lines[0].indexOf("x1=")+4;	
	end = lines[0].indexOf("y1=")-2;
	size = end - start;
	tempStr = parseInt(lines[0].substr(start, size));
	xSpacing = tempStr - xStartLine;
	//loop to find spacing of each column.
	for(var i = 1; i < lines.length; i++){
		start = lines[i].indexOf("x1=")+4;	
		end = lines[i].indexOf("y1=")-2;
		size = end - start;
		tempStr = parseInt(lines[i].substr(start, size));
		xSpacing2 = tempStr - xStartLine;
		spaceArray.push(xSpacing2-xSpacing);
		xSpacing = xSpacing2;
		colNo++;
	}
	spaceArray.shift();
	//gets array of labels
	labels = getLabels(sections[1], swapNo);
	strokeArray = getStrokes(sections[1], swapNo);
	xPosArray = getXPos(sections[1], swapNo);
	//gets populated columns for each row
	lines = sections[1];
	lines = getLines(lines);
	lines.shift();
	for (var i = 0; i < lines.length; i++) {
		rowOverlaps.push(rowPop(lines[i], colNo, spaceArray, xStartLine));
	}
	
	var holding = sortD(rowOverlaps, spaceArray);

	rowOverlaps = holding[0];
	spaceArray = holding[1];
	
	redrawOverlaps(rowOverlaps, spaceArray, sections, labels, xStartLine, spaceArray, yStartLbl, yStartLine, ySpacing, xPosArray, strokeArray, colNo);
}
//Function to get the number of gaps in a line.
function checkGapsL(arr, n1){
	var rowOverlaps = arr;
	var gaps = 0;
	var num = n1;
	var line = false;

	if(rowOverlaps[num][0] == true){
		line = true;
	} else {
		line = false;
	}
	
	for (var i = 1; i < rowOverlaps[num].length; i++) {
		if(rowOverlaps[num][i] == true && line == false){
			line == true;
		} else if(rowOverlaps[num][i] == true &&  line == true && rowOverlaps[num][i-1] == false) {
			gaps ++;
		}
	}

	return gaps;
}
//Function to get number of gaps in the diagram per line.
function checkGaps(arr){
	var rowOverlaps = arr;
	var gaps = 0;
	var gapNo = new Array();
	var space;
	for (var i = 0; i < rowOverlaps.length; i++) {
		gaps = 0;
		var space = false;
		if(rowOverlaps[i][0]==true){
			space = false;
		} else {
			space = true;
		}
		for(var j = 1; j < rowOverlaps[i].length-1; j++){
			if((space!=true)&&(rowOverlaps[i][j]==false)&&(rowOverlaps[i][j+1]==true)){
				gaps++
			}
			else if((rowOverlaps[i][j] == false) && (rowOverlaps[i][j-1] == true) && (rowOverlaps[i][j+1] == true)){
				gaps++
				space = true;
			} else {
				space = false;
			} 			 
		}
		gapNo.push(gaps);
	}
	gaps = 0;
	for (var i = 0; i < gapNo.length; i++) {
		gaps = gaps + gapNo[i];
	}
	
	return gaps;
}
//Function to get overlaps vertical
function swapCols(n1, n2){
	var svgCode = localStorage.getItem("svg");
	var labels = new Array();
	var rowOverlaps = new Array();
	var swapNo = new Array();
	var colOverLaps = new Array();
	var strokeArray = new Array();
	var xPosArray = new Array();
	var tempArr = new Array();
	var num1 = n1-1;
	var num2 = n2-1;
	//variables for y axis
	var yStartLbl;
	var yStartLine;
	var ySpacing;
	//variables for x axis
	var spaceArray = new Array();
	var xStartEnd;
	var xStartLine;
	var xSpacing;
	//temp values
	var start;
	var end;
	var size;
	var tempStr;
	var colNo = -1;
	var sections = separateSVG(svgCode);
	//GET Y AXIS VALUES
	var lines = sections[1];
	//gets label y start value
	yStartLbl = getYStart(lines);
	//gets line y start value
	yStartLine = getYStartLine(lines);
	//gets y axis spacing
	swapNo = getLineNo(lines);
	ySpacing = getYAxisSpace(lines, yStartLbl, swapNo);
	//GET X AXIS VALUES
	lines = sections[0];
	//gets starting x value
	xStartLine = getXLineStart(lines);
	//gets x End value
	xEnd = getXLineEnd(lines);
	//gets spacing of columns
	var xSpacing2;
	start = lines[0].indexOf("x1=")+4;	
	end = lines[0].indexOf("y1=")-2;
	size = end - start;
	tempStr = parseInt(lines[0].substr(start, size));
	xSpacing = tempStr - xStartLine;
	//loop to find spacing of each column.
	for(var i = 1; i < lines.length; i++){
		start = lines[i].indexOf("x1=")+4;	
		end = lines[i].indexOf("y1=")-2;
		size = end - start;
		tempStr = parseInt(lines[i].substr(start, size));
		xSpacing2 = tempStr - xStartLine;
		spaceArray.push(xSpacing2-xSpacing);
		xSpacing = xSpacing2;
		colNo++;
	}
	spaceArray.shift();
	//gets array of labels
	labels = getLabels(sections[1], swapNo);
	strokeArray = getStrokes(sections[1], swapNo);
	xPosArray = getXPos(sections[1], swapNo);
	//gets populated columns for each row
	lines = sections[1];
	lines = getLines(lines);
	lines.shift();
	for (var i = 0; i < lines.length; i++) {
		rowOverlaps.push(rowPop(lines[i], colNo, spaceArray, xStartLine));
	}
	//swaps columns
	colOverLaps = transpose(rowOverlaps);
	tempArr = colOverLaps[num1];
	colOverLaps[num1] = colOverLaps[num2];
	colOverLaps[num2] = tempArr;
	//swaps spacing for columns
	tempArr = spaceArray[num1];
	spaceArray[num1] = spaceArray[num2];
	spaceArray[num2] = tempArr;
	//reverts array back to row by row;
	rowOverlaps = transpose(colOverLaps);
		
	svgCode = redrawOverlaps(rowOverlaps, spaceArray, sections, labels, xStartLine, spaceArray, yStartLbl, yStartLine, ySpacing, xPosArray, strokeArray, colNo);
}
//Function to get x line end
function getXLineEnd(arr){
	var lines = arr;
	var last = lines.length-1;
	var start;
	var end;
	var size;

	start = lines[last].indexOf("x1=")+4;
	end = lines[last].indexOf("y1=")-2;
	size = end - start;
	xEnd = parseInt(lines[last].substr(start, size));

	return xEnd;
}
//Function to get x line start
function getXLineStart(arr){
	var lines = arr;
	var start;
	var end;
	var size;
	var xStartLine;

	start = lines[1].indexOf("x1=")+4;
	end = lines[1].indexOf("y1=")-2;
	size = end - start;
	xStartLine = parseInt(lines[1].substr(start, size));

	return xStartLine;
}
//Function to get y-axis spacing
function getYAxisSpace(arr, num, swapNo){
	var lines = arr;
	var swapNo = swapNo;
	var yStartLbl = num;
	var start;
	var end;
	var size;
	var tempStr;
	var ySpacing;
	
	start = lines[swapNo[1]].indexOf("y=")+3;
	end = lines[swapNo[1]].indexOf("fill")-2;
	size = end - start;
	tempStr = parseInt(lines[swapNo[1]].substr(start, size));
	ySpacing = tempStr - yStartLbl;

	return ySpacing;
}
//Function to get line y-Start value
function getYStartLine(arr){
	var start;
	var end;
	var size;
	var yStartLine;
	var lines = arr;

	start = lines[2].indexOf("y1=")+4;
	end = lines[2].indexOf("x2")-2;
	size = end - start;
	yStartLine = parseInt(lines[2].substr(start, size));

	return yStartLine;
}
//Function to get label y-start value
function getYStart(arr){
	var start;
	var end;
	var size;
	var yStartLbl;
	var lines = arr;

	start = lines[0].indexOf("y=")+3;
	end = lines[0].indexOf("fill")-2;
	size = end - start;
	yStartLbl = parseInt(lines[0].substr(start, size));

	return yStartLbl;
}
//Function to redraw from overlaps (must be horizontal overlaps)
function redrawOverlaps(rowsArray, colSpaces, sectionsArr, labelsArr, xStartLine, xSpacing, yStartLbl, yStartLine, ySpacing, labelPos, strokes, colNo){
	var rowOverlaps = rowsArray;
	var spaceArray = colSpaces;
	var sections = sectionsArr;
	var labels = labelsArr;
	var xPos = labelPos;
	var strokes = strokes;
	var tempArr = new Array();
	var xStartLine = xStartLine;
	var xSpacing = xSpacing;
	var xEnd;
	var yStartLbl = ySpacing +5;
	var yStartLine = yStartLine;
	var ySpacing = ySpacing;
	var tempStr = "";
	var linesArray = new Array();
	var tempArr = new Array();
	var tempStrArr = new Array();
	var  newStart = new Array();
	var startVal = xStartLine;
	var colNo = colNo;
	//redraws portion of the svg string with addition of new information
	for (var i = 0; i < labels.length; i++) {
		tempStr = 'text id="'+labels[i]+'" x="' +xPos[i]+'" y="'+yStartLbl+'" fill="'+strokes[i]+'" font-family="sans-serif" font-weight="bold" font-size="12px" clip-path="url(#clip1)" >'+labels[i]+'</text>'+"\n";
		tempStrArr.push(tempStr);
		tempStr = "";
		tempArr = rowOverlaps[i];
		xStartLine = startVal;
		xEnd = xStartLine + xSpacing[0];
		if(tempArr[0]==true){
			tempStr = 'line x1="'+xStartLine+'" y1="'+yStartLine+'" x2="'+xEnd+'" y2="'+yStartLine+'" stroke="'+strokes[i]+'" stroke-width="4" />'+"\n";
		}
		for (var j = 1; j < tempArr.length; j++) {
			if(tempArr[j]==true&&tempArr[j-1]==true){
				xEnd = xEnd + xSpacing[j];
				tempStr = 'line x1="'+xStartLine+'" y1="'+yStartLine+'" x2="'+xEnd+'" y2="'+yStartLine+'" stroke="'+strokes[i]+'" stroke-width="4" />'+"\n";
			} else if(tempArr[j]==true&&tempArr[j-1]!=true) {
				xStartLine = xEnd;
				xEnd = xStartLine + xSpacing[j];
				tempStr = 'line x1="'+xStartLine+'" y1="'+yStartLine+'" x2="'+xEnd+'" y2="'+yStartLine+'" stroke="'+strokes[i]+'" stroke-width="4" />'+"\n";
			} else if(tempArr[j]!=true&&tempArr[j-1]==true) {
				tempStrArr.push(tempStr);
				xStartLine = xEnd;
				xEnd = xStartLine + xSpacing[j];
				tempStr = "";
			} else if(tempArr[j]!=true&&tempArr[j-1]!=true){
				xStartLine = xEnd;
				xEnd = xStartLine + xSpacing[j];
			}
		}
		if(tempStr != ""){
			tempStrArr.push(tempStr);
		}
		tempStr="";
		yStartLine = yStartLine + ySpacing;
		yStartLbl = yStartLbl + ySpacing;
	}

	newStart = changeGuide(sections[0], spaceArray, colNo);
	
	sections[0] = newStart;
	sections[1] = tempStrArr;
	//rebuilds lines array
	linesArray= rebuildLinesArray(sections);
	//rebuilds svgCode
	svgCode = rebuildSvg(linesArray);
	//puts code into local storage to be redrawn by page.
	localStorage.setItem("svg", svgCode);
	
}
//Function to change guides when columns swap
function changeGuide(arr, spaceArr, cols){
	var lines = arr;
	var spaces = spaceArr;
	var xStart;
	var colNo = cols;
	var start;
	var end;
	var size; 
	var y1;
	var y2;
	var newArr = new Array();
	
	//gets min x value
	start = lines[1].indexOf("x1=")+4;
	end = lines[1].indexOf("y1")-2;
	size = end - start;
	xStart = parseInt(lines[1].substr(start, size));
	//gets min y value
	start = lines[1].indexOf("y1=")+4;
	end = lines[1].indexOf("x2")-2;
	size = end - start;
	y1 = lines[1]. substr(start, size);
	//gets max y value
	start = lines[1].indexOf("y2=")+4;
	end = lines[1].indexOf("stroke")-2;
	size = end - start;
	y2 = lines[1].substr(start, size);

	newArr.push(lines[0]);
	tempStr = 'line  x1="'+ xStart +'" y1="'+ y1 +'" x2="'+ xStart +'" y2="'+ y2 +'" stroke="#696969" stroke-width="1" />'+"\n";
	newArr.push(tempStr);
	tempStr = "";
	
	for (var i = 1; i < colNo+1; i++) {
		xStart = xStart + spaces[i-1];
		tempStr = 'line  x1="'+ xStart +'" y1="'+ y1 +'" x2="'+ xStart +'" y2="'+ y2 +'" stroke="#696969" stroke-width="1" />'+"\n";
		newArr.push(tempStr);
		tempStr = "";
	}	
	
	
	return newArr;
}	
//Function to transpose matrix to change from rows to cols / cols to rows
function transpose(array) {
    return Object.keys(array[0]).map(function (c) {
        return array.map(function (r) {
            return r[c];
        });
    });
}
//Function to get array of labels
function getLabels(lines, swaps){
	var lines = lines;
	var swapNo = swaps;
	var labels = new Array();

	for(var i = 0; i < swapNo.length; i++){
		start = lines[swapNo[i]].indexOf("id=")+4;
		end = lines[swapNo[i]].indexOf("x=")-2;
		size = end - start;
		tempStr = lines[swapNo[i]].substr(start, size);
		labels.push(tempStr);
	}
	return labels;
}
//Function to get label xPos
function getXPos(lines, swapNo){
	var lines = lines;
	var swapNo = swapNo;
	var xPos = new Array();

	for (var i = 0; i < swapNo.length; i++) {
		for(var i = 0; i < swapNo.length; i++){
		start = lines[swapNo[i]].indexOf("x=")+3;
		end = lines[swapNo[i]].indexOf("y=")-2;
		size = end - start;
		tempStr = lines[swapNo[i]].substr(start, size);
		xPos.push(tempStr);
	}
	return xPos;
	}
}
//Function to get array of colours
function getStrokes(lines, swaps ){
	var lines = lines;
	var swapNo = swaps;
	var strokes = new Array();

	for(var i = 0; i < swapNo.length; i++){
		start = lines[swapNo[i]].indexOf("fill")+6;
		end = lines[swapNo[i]].indexOf("font")-2;
		size = end - start;
		tempStr = lines[swapNo[i]].substr(start, size);
		strokes.push(tempStr);
	}
	return strokes;
}
//puts row population into array of booleans
function rowPop(string, cols, xSpaces, xStartLine){
	var colNo = cols;
	var xSpacing = xSpaces;
	var lines = new Array();
	var rowsArray = new Array();
	var colStart = xStartLine;
	var cond;
	var colEnd;
	var start;
	var end;
	var size;
	var x1;
	var x2;
	
	lines = splitSvg(string);
	//loops through each column
	for (var i = 0; i < colNo; i++) {
		cond = false;
		//gets end value of column
		colEnd = colStart + xSpacing[i];
		//loops through all lines passed from svg string
		for (var j = 0; j < lines.length; j++) {
			//get start of line x co ord
			if(lines[j].includes("line")){
			start = lines[j].indexOf("x1=")+4;
			end = lines[j].indexOf("y1")+2;
			size = end - start;
			x1 = parseInt(lines[j].substr(start, size));
			//get end of line x co-ord
			start = lines[j].indexOf("x2=")+4;
			end = lines[j].indexOf("y2")+2;
			size = end - start;
			x2 = parseInt(lines[j].substr(start, size));
			//if the column boundaries are equal to or lie within
			//the line, the column is populated.
			if(colStart >= x1 && colEnd <= x2){
					cond = true;
				}
			}
		}
		//pushes the column condition to the array.
		rowsArray.push(cond);
		//sets the new start pos as the end of the previous column.
		colStart = colEnd;
	}
	return rowsArray;
}
//finds number of columns in diagram
function getCols(xStart, xEnd, xSpacing){
	var colsNo;
	colsNo = (xEnd - xStart)/xSpacing;
	return colsNo;
}
//Swaps 2 rows in the SVG, uses body section of the svg (sections[1]);
function swapRows(n1, n2){
	var linesArray = new Array();
	var swapLines = new Array();
	var svgStr = localStorage.getItem("svg");
	var svgCode;
	var num1 = n1-1;
	var num2 = n2-1;
	var swapNo = new Array(); 
	var tempStr = "";
	var y1 = "";
	var y2 = "";
	var start;
	var end;
	var size=0;

	var sections = separateSVG(svgStr);
	var lines = sections[1];
	//LABEL SWAP START
	//finds the index of the main line for each label
	swapNo = getLineNo(lines);
	//gets substring of y value for first line
	start = lines[swapNo[num1]].indexOf('y=');
	end = lines[swapNo[num1]].indexOf('fill=');
	size = end - start;
	y1 = lines[swapNo[num1]].substr(start, size);
	//gets substring for y value for second line
	start = lines[swapNo[num2]].indexOf('y=');
	end = lines[swapNo[num2]].indexOf('fill=');
	size = end - start;
	y2 = lines[swapNo[num2]].substr(start, size);
	//swap "y=" sections of the strings
	tempStr = lines[swapNo[num1]].replace(y1,y2);
	lines[swapNo[num1]] = tempStr;
	tempStr = lines[swapNo[num2]].replace(y2,y1);
	lines[swapNo[num2]] = tempStr;
	//LABEL SWAP END
	//LINES SWAP START
	tempStr = "";
	num1 = n1;
	num2 = n2;
	swapLines = getLines(lines);
	//gets substring of y1 value for first line
	start = swapLines[num1].indexOf('y1="');
	end = swapLines[num1].indexOf('x2=');
	size = end - start;
	y1 = swapLines[num1].substr(start, size);
	//gets substring for y1 value for second line
	start = swapLines[num2].indexOf('y1="');
	end = swapLines[num2].indexOf('x2=');
	size = end - start;
	y2 = swapLines[num2].substr(start, size);
	//swap y1 values for both lines
	tempStr = swapLines[num1].replace(RegExp(y1, "g"),y2);
	swapLines[num1] = tempStr;
	tempStr = swapLines[num2].replace(RegExp(y2, "g"),y1);
	swapLines[num2] = tempStr;
	//gets substring of y2 value for first line
	start = swapLines[num1].indexOf('y2="');
	end = swapLines[num1].indexOf(' stroke=');
	size = end - start;
	y1 = swapLines[num1].substr(start, size);
	//gets substring for y2 value for second line
	start = swapLines[num2].indexOf('y2="');
	end = swapLines[num2].indexOf(' stroke=');
	size = end - start;
	y2 = swapLines[num2].substr(start, size);
	//swap y2 values for both lines
	tempStr = swapLines[num1].replace(RegExp(y1, "g"),y2);
	swapLines[num1] = tempStr;
	tempStr = swapLines[num2].replace(RegExp(y2, "g"),y1);
	swapLines[num2] = tempStr;
	lines = swapLines[num1];
	swapLines[num1] = swapLines[num2]
	swapLines[num2] = lines;
	swapLines.shift();
	//LINES SWAP END
	//sets the new value of sections[1] as the changes lines
	sections[1] = swapLines;
	//rebuilds lines array
	linesArray = rebuildLinesArray(sections);
	//rebuilds svgCode
	svgCode = rebuildSvg(linesArray);
	//alert(svgCode);
	//puts code into local storage to be redrawn by page.
	localStorage.setItem("svg", svgCode);
}
//Function to separate elements of a diagram
function getLines(input){
	var lines = input;
	var tempStr;
	var swapLines = new Array();
	for(var i = 0; i < lines.length; i++){
		if(lines[i].includes("text id=")){
			swapLines.push(tempStr);
			tempStr = "";
			tempStr += lines[i];

		} else {
			tempStr += "<";
			tempStr += lines[i];
		}	
	}
	swapLines.push(tempStr);

	return swapLines;
}
//Function to split svg into start, body and end sections
function separateSVG(svgStr){
	var lines = new Array();//middle section, contains all labels and lines
	var linesEnd = new Array();//end section of svg, 
	var linesArray = new Array();//contains the svg file up to the last guide line, will be reassembled later.
	var sections = new Array();
	var svgCode = svgStr;
	var lastGuide = 0;
	linesArray = splitSvg(svgCode);
	linesArray.shift();
	//finds where last guide line is drawn.
	for(var i = 0; i < linesArray.length; i++){
		if((linesArray[i].includes("text id="))&&(lastGuide == 0)){
			lastGuide = i-1;
		}
	}
	//separates into lines and end section of svg Code.
	lines = linesArray.splice(lastGuide+1);
	linesEnd = lines.splice(lines.length-4);
	//Sets a returnable array with 3 sections of the svg file,
	//sections[0] is the beginning /w guides.
	//sections[1] is the middle /w main labels and lines.
	//sections[2] is the end of the svg string.
	sections.push(linesArray);
	sections.push(lines);
	sections.push(linesEnd);

	return sections;
}
//Function to get lines used for labels
function getLineNo(input){
	var swapNo = new Array();
	var lines = input;
	for(var i = 0; i< lines.length; i++){
		if(lines[i].includes("text id=")){
			swapNo.push(i);
		}
	}
	return swapNo;
}
//Function to get height of diagram
function getHeight(str){
	var lines = str;
	var start;
	var end;
	var size;
	var height;

	start = lines.indexOf('height=');
	end = lines.indexOf('>');
	size = end - start;
	height = lines.substr(start, size);

	return height;
}