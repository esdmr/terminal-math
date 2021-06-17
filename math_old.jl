#
# Why is the julia version x10 slower
# than the javascript version?!
#

@enum DD left right
@enum DT round square curly floor ceil vert dbvert hidden
@enum OT text unary binary fname
@enum ST rm sf sc fr tt bb
# @enum UT null terminal styled stack fraction root delimt

PI = 'π'

struct Terminal
	op::OT
	ch::Char
end

struct Styled
	op::OT
	ch::Char
	tf::ST
	bf::Bool
	it::Bool
end

struct Stack{TGroup}
	sup::TGroup
	sub::TGroup
end

struct Fraction{TGroup}
	num::TGroup
	den::TGroup
end

struct Root{TGroup}
	rad::TGroup
	deg::TGroup
end

struct Delimit{TGroup}
	del::DT
	rdl::DT
	val::TGroup
	stk::Union{Stack,Nothing}
end

struct NullBox
end

struct TGroup
	data::Array{Union{Terminal, Styled, Stack{TGroup}, Fraction{TGroup}, Root{TGroup}, Delimit{TGroup}, NullBox}, 1}
end

TUnit = Union{Terminal,Styled,Stack{TGroup},Fraction{TGroup},Root{TGroup},Delimit{TGroup},NullBox}

struct ImageData
	data::Array{Char, 2}
	width::UInt32
	height::UInt32
end

struct Box
	render::Function
	width::UInt32
	height::UInt32
	depth::UInt32
	marleft::UInt32
	marright::UInt32
end

mutable struct BoxMargin
	marleft::UInt32
	marright::UInt32
end

function draw(canvas::ImageData, x::Number, y::Number, value::Char)
	canvas.data[begin + x, begin + y] = value
end

function compile_group(group::TGroup)
	len = length(group.data)
	if len === 1
		return compile_unit(group.data[begin])
	elseif len === 0
		return compile_unit(NullBox())
	end

	boxes = compile_unit.(group.data)
	margins = map(box -> BoxMargin(0, 0), group.data)

	for i in 0:len - 2
		margins[begin + i].marright = max(boxes[begin + i].marright, boxes[begin + i + 1].marleft)
		margins[begin + i + 1].marleft = 0
	end

	width = 0
	height = 0
	depth = 0

	for (box, margin) in zip(boxes, margins)
		width += margin.marleft + box.width + margin.marright
		height = max(height, box.height)
		depth = max(depth, box.depth)
	end

	return Box((canvas::ImageData, x::Number, y::Number) -> begin
		for (box, margin) in zip(boxes, margins)
			x += margin.marleft
			box.render(canvas, x, y)
			x += box.width
			x += margin.marright
		end
	end, width, height, depth, box[begin].marleft, box[end].marright)
end

function compile_stack(unit::Stack, hsp::UInt32, dsp::UInt32)
	sup = compile_group(unit.sup)
	sub = compile_group(unit.sub)

	return Box((canvas::ImageData, x::Number, y::Number) -> begin
		sup.render(canvas, x, y - sup.depth - hsp)
		sub.render(canvas, x, y + sub.height - dsp)
	end, max(sup.width, sub.width), sup.height + sup.depth + hsp, sub.height + sub.depth + dsp, 0, 0)
end

function compile_unit(unit::TUnit)
	type = typeof(unit)

	if type == NullBox
		return Box(() -> nothing, 0, 0, 0, 0, 0)

	elseif type == Terminal
		margin = unit.op == text || unit.op == unary ? 0 : 1

		return Box((canvas::ImageData, x::Number, y::Number) -> begin
			draw(canvas, x, y, unit.ch)
		end, 1, 1, 0, margin, margin)

	elseif type == Stack{TGroup}
		compile_stack(unit, 1, 0)

	elseif type == Fraction{TGroup}
		num = compile_group(unit.num)
		den = compile_group(unit.den)
		width = max(num.width, den.width)
		numoff = div(width - num.width, 2)
		denoff = div(width - den.width, 2)

		return Box((canvas::ImageData, x::Number, y::Number) -> begin
			num.render(canvas, x + 1 + numoff, y - num.depth - 1)
			den.render(canvas, x + 1 + denoff, y + den.height)

			for i in 0:width + 1
				draw(canvas, x + i, y, '─')
			end
		end, width + 2, num.height + num.depth + 1, den.height + den.depth, 1, 1)

	else
		error("Invalid unit type")
	end
end

const resbox = compile_unit(Fraction(TGroup([Terminal(text, 'a')]), TGroup([Terminal(text, 'b')])))
const canvaw = resbox.width
const canvah = resbox.height + resbox.depth
const cnvarr = Array{Char, 2}(undef, canvaw, canvah)
fill!(cnvarr, ' ')
const canvas = ImageData(cnvarr, canvaw, canvah)
resbox.render(canvas, 0, resbox.height - 1)
print("\n ")
for (i, value) in enumerate(canvas.data)
	print(value)

	if (i - 1) % canvaw == canvaw - 1
		print("\n ")
	end
end
print('\n')
